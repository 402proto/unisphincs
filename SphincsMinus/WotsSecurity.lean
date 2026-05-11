/-
Copyright (c) 2026 Vitalik Buterin. All rights reserved.
Released under Apache 2.0 license as described in the file LICENSE.
Authors: Vitalik Buterin
-/
import SphincsMinus.WOTS

/-!
# WOTS+ Checksum Security Theorem

For any two distinct message digests, the resulting full WOTS+ digit vectors
(message digits + checksum digits) are incomparable under the pointwise ≤
ordering. This prevents an attacker from forging signatures by extending
hash chains.

See FIPS 205 §5.4 for the specification that this proof validates.
-/

namespace SphincsMinus

open SphincsMinus

/-! ### Pointwise ordering on lists -/

variable {α β : Type}

/-- Pointwise relation: `Forall₂ R xs ys` means `xs` and `ys` have equal length
and corresponding elements are related by `R`. -/
inductive Forall₂ (R : α → β → Prop) : List α → List β → Prop
  | nil  : Forall₂ R [] []
  | cons {a : α} {b : β} {as : List α} {bs : List β} :
      R a b → Forall₂ R as bs → Forall₂ R (a :: as) (b :: bs)

theorem Forall₂.length_eq {R : α → β → Prop} {xs : List α} {ys : List β}
    (h : Forall₂ R xs ys) : xs.length = ys.length := by
  induction h with
  | nil => rfl
  | cons _ _ ih => simp [ih]

theorem Forall₂.sum_le {xs ys : List Nat} (h : Forall₂ (· ≤ ·) xs ys) :
    xs.sum ≤ ys.sum := by
  induction h with
  | nil => exact Nat.le_refl 0
  | cons hd htl ih =>
    simp [List.sum_cons]
    exact Nat.add_le_add hd ih

theorem Forall₂.eq_of_sum_eq {xs ys : List Nat}
    (hLE : Forall₂ (· ≤ ·) xs ys) (hSum : xs.sum = ys.sum) : xs = ys := by
  match xs, ys, hLE with
  | [], [], .nil => rfl
  | a::as, b::bs, .cons hd htl =>
    simp [List.sum_cons] at hSum
    have hSumLE : as.sum ≤ bs.sum := htl.sum_le
    by_cases hlt : a < b
    · have h1 : a + as.sum < b + as.sum := Nat.add_lt_add_right hlt as.sum
      have h2 : b + as.sum ≤ b + bs.sum := Nat.add_le_add_left hSumLE b
      have : a + as.sum < b + bs.sum := Nat.lt_of_lt_of_le h1 h2
      rw [hSum] at this
      exact absurd this (Nat.lt_irrefl _)
    · have hge : b ≤ a := Nat.ge_of_not_lt hlt
      have heq : a = b := Nat.le_antisymm hd hge
      subst heq
      have hSumAsEq : as.sum = bs.sum := Nat.add_left_cancel hSum
      have hAsEqBs : as = bs := Forall₂.eq_of_sum_eq htl hSumAsEq
      rw [hAsEqBs]

/-! ### Splitting Forall₂ at equal-length prefixes -/

theorem Forall₂.take {xs ys : List α} {R : α → α → Prop}
    (h : Forall₂ R xs ys) (n : Nat) : Forall₂ R (xs.take n) (ys.take n) := by
  induction h generalizing n with
  | nil => 
    simp
    exact .nil
  | cons hd htl ih =>
    cases n with
    | zero => 
      simp
      exact .nil
    | succ n => 
      simp
      exact .cons hd (ih n)

theorem Forall₂.drop {xs ys : List α} {R : α → α → Prop}
    (h : Forall₂ R xs ys) (n : Nat) : Forall₂ R (xs.drop n) (ys.drop n) := by
  induction h generalizing n with
  | nil => 
    simp
    exact .nil
  | cons hd htl ih =>
    cases n with
    | zero => 
      simp
      exact .cons hd htl
    | succ n => 
      simp
      exact ih n

theorem Forall₂.append_inv {R : α → α → Prop} {xs₁ xs₂ ys₁ ys₂ : List α}
    (h : Forall₂ R (xs₁ ++ ys₁) (xs₂ ++ ys₂))
    (hlen : xs₁.length = xs₂.length) :
    Forall₂ R xs₁ xs₂ ∧ Forall₂ R ys₁ ys₂ := by
  -- (xs₁ ++ ys₁).take xs₁.length = xs₁, and similarly for xs₂
  have take1 : (xs₁ ++ ys₁).take xs₁.length = xs₁ := by
    induction xs₁ with
    | nil => simp
    | cons _ _ ih => simp [ih]
  have drop1 : (xs₁ ++ ys₁).drop xs₁.length = ys₁ := by
    induction xs₁ with
    | nil => simp
    | cons _ _ ih => simp [ih]
  have take2 : (xs₂ ++ ys₂).take xs₂.length = xs₂ := by
    induction xs₂ with
    | nil => simp
    | cons _ _ ih => simp [ih]
  have drop2 : (xs₂ ++ ys₂).drop xs₂.length = ys₂ := by
    induction xs₂ with
    | nil => simp
    | cons _ _ ih => simp [ih]
  have htake := h.take xs₁.length
  rw [take1, hlen, take2] at htake
  have hdrop := h.drop xs₁.length
  rw [drop1, hlen, drop2] at hdrop
  exact ⟨htake, hdrop⟩

/-! ### Base-w digit arithmetic -/

def fromBaseW (w : Nat) (digits : List Nat) : Nat :=
  digits.foldl (λ acc d => acc * w + d) 0

@[simp]
theorem fromBaseW_nil (w : Nat) : fromBaseW w [] = 0 := rfl

private theorem foldl_fromBaseW_shift (w : Nat) (a : Nat) (ds : List Nat) :
    List.foldl (λ acc d => acc * w + d) a ds = a * w ^ ds.length + fromBaseW w ds := by
  induction ds generalizing a with
  | nil => simp [fromBaseW]
  | cons d ds ih =>
    simp [List.foldl, fromBaseW, ih (a * w + d), ih d]
    -- Goal: (a*w + d)*w^|ds| + fb = a*w^(|ds|+1) + (d*w^|ds| + fb)   [fb = fromBaseW w ds]
    rw [Nat.add_mul, Nat.pow_succ, Nat.mul_comm (w ^ ds.length) w, ← Nat.mul_assoc a w, Nat.add_assoc]

@[simp]
theorem fromBaseW_cons (w d : Nat) (ds : List Nat) :
    fromBaseW w (d :: ds) = d * w ^ ds.length + fromBaseW w ds := by
  simp [fromBaseW, foldl_fromBaseW_shift w d ds]

theorem fromBaseW_append (w : Nat) (xs ys : List Nat) :
    fromBaseW w (xs ++ ys) = fromBaseW w xs * w ^ ys.length + fromBaseW w ys := by
  rw [fromBaseW, List.foldl_append, fromBaseW]
  exact foldl_fromBaseW_shift w (List.foldl (λ acc d => acc * w + d) 0 xs) ys

/-- Helper: pointwise ≤ at the foldl level with an accumulator. -/
private theorem foldl_acc_le (ds1 ds2 : List Nat) (w : Nat) (a b : Nat) (hAcc : a ≤ b)
    (hLE : Forall₂ (· ≤ ·) ds1 ds2) :
    List.foldl (λ acc d => acc * w + d) a ds1 ≤
    List.foldl (λ acc d => acc * w + d) b ds2 := by
  match ds1, ds2, hLE with
  | [], [], .nil => exact hAcc
  | d1::ds1', d2::ds2', .cons hd htl =>
    simp [List.foldl]
    refine foldl_acc_le ds1' ds2' w (a * w + d1) (b * w + d2) ?_ htl
    exact Nat.add_le_add (Nat.mul_le_mul hAcc (Nat.le_refl _)) hd

theorem fromBaseW_pointwiseLE {ds1 ds2 : List Nat} {w : Nat}
    (hLE : Forall₂ (· ≤ ·) ds1 ds2) : fromBaseW w ds1 ≤ fromBaseW w ds2 := by
  have h := foldl_acc_le ds1 ds2 w 0 0 (Nat.le_refl 0) hLE
  exact h

def digitsOfBaseW (n w len : Nat) : List Nat :=
  match len with
  | 0 => []
  | len+1 => ((n / w ^ len) % w) :: digitsOfBaseW n w len

theorem digitsOfBaseW_nil (n w : Nat) : digitsOfBaseW n w 0 = [] := rfl

theorem digitsOfBaseW_length (n w len : Nat) : (digitsOfBaseW n w len).length = len := by
  induction len with
  | zero => simp [digitsOfBaseW]
  | succ len ih => simp [digitsOfBaseW, ih]

/--
The key modular identity: `n % (w^(len+1)) = ((n/w^len) % w) * w^len + n % w^len`.

This says the base-w LSB-centric expansion of n mod w^(len+1) can be obtained
by extracting the len-th digit and combining with the remainder mod w^len.
-/
theorem mod_pow_succ_extract (n w len : Nat) (hw : 0 < w) :
    n % (w ^ (len + 1)) = ((n / w ^ len) % w) * w ^ len + n % w ^ len := by
  let M := w ^ len
  let MW := M * w
  let R := ((n / M) % w) * M + n % M
  let q := (n / M) / w
  have hMW_eq : MW = w ^ (len + 1) := by
    dsimp [MW, M]; rw [Nat.pow_succ]
  rw [← hMW_eq]
  -- Goal: n % MW = R
  -- Step 1: bound R < MW
  have h_bound : R < MW := by
    dsimp [R, MW, M]
    have h1 : (n / (w ^ len)) % w < w := Nat.mod_lt (n / (w ^ len)) hw
    have h2 : n % (w ^ len) < w ^ len := Nat.mod_lt n (Nat.pow_pos (a := w) (n := len) hw)
    have hMpos : 0 < w ^ len := Nat.pow_pos (a := w) (n := len) hw
    -- d < w → d ≤ w-1,  b < M → b ≤ M-1
    have h_dle : (n / (w ^ len)) % w ≤ w - 1 := Nat.le_sub_one_of_lt h1
    have h_ble : n % (w ^ len) ≤ (w ^ len) - 1 := Nat.le_sub_one_of_lt h2
    -- d*M + b ≤ (w-1)*M + (M-1) < M*w
    have h_mul : ((n / (w ^ len)) % w) * (w ^ len) ≤ (w - 1) * (w ^ len) :=
      Nat.mul_le_mul h_dle (Nat.le_refl _)
    have h_sum_le : ((n / (w ^ len)) % w) * (w ^ len) + n % (w ^ len) ≤ (w - 1) * (w ^ len) + ((w ^ len) - 1) :=
      Nat.add_le_add h_mul h_ble
    have h_final : (w - 1) * (w ^ len) + ((w ^ len) - 1) < (w ^ len) * w := by
      have h_sub_lt : (w ^ len) - 1 < w ^ len := Nat.sub_lt hMpos (by omega)
      have h_lt : (w - 1) * (w ^ len) + ((w ^ len) - 1) < (w - 1) * (w ^ len) + (w ^ len) :=
        Nat.add_lt_add_left h_sub_lt ((w - 1) * (w ^ len))
      have h_eq : (w - 1) * (w ^ len) + (w ^ len) = (w ^ len) * w := by
        calc
          (w - 1) * (w ^ len) + (w ^ len) = ((w - 1) + 1) * (w ^ len) := by rw [← Nat.succ_mul]
          _ = w * (w ^ len) := by rw [Nat.sub_add_cancel (Nat.one_le_of_lt hw)]
          _ = (w ^ len) * w := Nat.mul_comm _ _
      simpa [h_eq] using h_lt
    exact Nat.lt_of_le_of_lt h_sum_le h_final
  -- Step 2: decomposition n = q*MW + R
  have h1 := Nat.div_add_mod n M
  -- h1: M * (n/M) + n%M = n
  have h2 := Nat.div_add_mod (n / M) w
  -- h2: w * ((n/M)/w) + (n/M)%w = n/M
  have h_n_eq : n = q * MW + R := by
    dsimp [R, MW, M, q]
    calc
      n = (w ^ len) * (n / (w ^ len)) + n % (w ^ len) := by rw [h1]
      _ = (w ^ len) * (w * ((n / (w ^ len)) / w) + (n / (w ^ len)) % w) + n % (w ^ len) := by rw [h2]
      _ = (w ^ len) * (w * ((n / (w ^ len)) / w)) + (w ^ len) * ((n / (w ^ len)) % w) + n % (w ^ len) := by rw [Nat.mul_add]
      _ = ((w ^ len) * w) * ((n / (w ^ len)) / w) + ((n / (w ^ len)) % w) * (w ^ len) + n % (w ^ len) := by
        rw [Nat.mul_assoc, Nat.mul_comm ((n / (w ^ len)) % w) (w ^ len)]
      _ = ((n / (w ^ len)) / w) * ((w ^ len) * w) + (((n / (w ^ len)) % w) * (w ^ len) + n % (w ^ len)) := by
        simp [Nat.mul_comm, Nat.add_comm, Nat.add_assoc]
  -- Step 3: n % MW = R
  calc
    n % MW = (q * MW + R) % MW := by rw [h_n_eq]
    _ = R % MW := by simp
    _ = R := Nat.mod_eq_of_lt h_bound


theorem fromBaseW_digitsOfBaseW_eq_mod (n w len : Nat) (hw : 0 < w) :
    fromBaseW w (digitsOfBaseW n w len) = n % (w ^ len) := by
  induction len generalizing n with
  | zero => simp [digitsOfBaseW, fromBaseW, Nat.mod_one]
  | succ len ih =>
    -- ih : ∀ n, fromBaseW w (digitsOfBaseW n w len) = n % w ^ len
    simp [digitsOfBaseW, fromBaseW_cons, digitsOfBaseW_length n w len, ih n]
    rw [mod_pow_succ_extract n w len hw]

theorem fromBaseW_digitsOfBaseW_of_lt (n w len : Nat) (hw : 0 < w)
    (h : n < w ^ len) : fromBaseW w (digitsOfBaseW n w len) = n := by
  rw [fromBaseW_digitsOfBaseW_eq_mod n w len hw]
  exact Nat.mod_eq_of_lt h

theorem digitsOfBaseW_pointwiseLE_imp_le {a b w len : Nat} (hw : 0 < w)
    (ha : a < w ^ len) (hb : b < w ^ len)
    (hLE : Forall₂ (· ≤ ·) (digitsOfBaseW a w len) (digitsOfBaseW b w len)) :
    a ≤ b := by
  have ha' : fromBaseW w (digitsOfBaseW a w len) = a :=
    fromBaseW_digitsOfBaseW_of_lt a w len hw ha
  have hb' : fromBaseW w (digitsOfBaseW b w len) = b :=
    fromBaseW_digitsOfBaseW_of_lt b w len hw hb
  have hValLE : fromBaseW w (digitsOfBaseW a w len) ≤
               fromBaseW w (digitsOfBaseW b w len) :=
    fromBaseW_pointwiseLE hLE
  simpa [ha', hb'] using hValLE

/-! ### WOTS+ checksum -/

def wotsChecksumValue (w : Nat) (digits : List Nat) : Nat :=
  (digits.map (λ d => w - 1 - d)).sum

private theorem checksum_each_le (w : Nat) (digits : List Nat)
    (hBound : ∀ d ∈ digits, d < w) : ∀ x ∈ digits.map (λ d => w - 1 - d), x ≤ w - 1 := by
  intro x hx
  rcases List.mem_map.mp hx with ⟨d, hd, rfl⟩
  have hlt : d < w := hBound d hd
  omega

private theorem sum_le_length_mul (xs : List Nat) (M : Nat)
    (h : ∀ x ∈ xs, x ≤ M) : xs.sum ≤ xs.length * M := by
  induction xs with
  | nil => simp
  | cons x xs ih =>
    simp [List.sum_cons]
    have hx : x ≤ M := h x (by simp)
    have hxs : ∀ y ∈ xs, y ≤ M := λ y hy => h y (by simp [hy])
    have ih' : xs.sum ≤ xs.length * M := ih hxs
    have h_goal : x + xs.sum ≤ (xs.length + 1) * M := by
      have h1 : x + xs.sum ≤ M + xs.sum := Nat.add_le_add_right hx xs.sum
      have h2 : M + xs.sum ≤ M + xs.length * M := Nat.add_le_add_left ih' M
      have h_eq : M + xs.length * M = (xs.length + 1) * M := by
        rw [Nat.succ_mul, Nat.add_comm]
      rw [h_eq] at h2
      exact Nat.le_trans h1 h2
    exact h_goal

theorem wotsChecksumValue_le {digits : List Nat} {w l1 : Nat}
    (hLen : digits.length = l1) (hBound : ∀ d ∈ digits, d < w) :
    wotsChecksumValue w digits ≤ l1 * (w - 1) := by
  rw [wotsChecksumValue]
  have h_each := checksum_each_le w digits hBound
  have h_len_map : (digits.map (λ d => w - 1 - d)).length = l1 := by simp [hLen]
  have h_sum_bound := sum_le_length_mul (digits.map (λ d => w - 1 - d)) (w - 1) h_each
  rw [h_len_map] at h_sum_bound
  exact h_sum_bound

def wotsFullDigits (dig : List Nat) (w l1 l2 : Nat) : List Nat :=
  let csum := wotsChecksumValue w dig
  dig ++ digitsOfBaseW csum w l2

theorem wotsFullDigits_length (dig : List Nat) (w l1 l2 : Nat)
    (hLen : dig.length = l1) : (wotsFullDigits dig w l1 l2).length = l1 + l2 := by
  simp [wotsFullDigits, hLen, digitsOfBaseW_length]

/-! ### Checksum algebra -/

theorem wotsChecksumValue_add_sum_eq (w : Nat) (digits : List Nat)
    (hBound : ∀ d ∈ digits, d < w) :
    wotsChecksumValue w digits + digits.sum = digits.length * (w - 1) := by
  rw [wotsChecksumValue]
  induction digits with
  | nil => simp
  | cons d ds ih =>
    have hBound' : ∀ d' ∈ ds, d' < w := λ d' hd' => hBound d' (by simp [hd'])
    have h_ih := ih hBound'
    rw [List.map_cons, List.sum_cons, List.sum_cons]
    -- Goal: (w-1-d) + (map f ds).sum + (d + ds.sum) = (ds.length+1)*(w-1)
    have hd_lt_w : d < w := hBound d (by simp)
    have h_all : (w - 1 - d) + (ds.map (λ d' => w - 1 - d')).sum + (d + ds.sum) = 
        (w - 1) + ds.length * (w - 1) := by
      have hsub : (w - 1 - d) + d = w - 1 := by omega
      calc
        (w - 1 - d) + (ds.map (λ d' => w - 1 - d')).sum + (d + ds.sum)
            = ((w - 1 - d) + d) + ((ds.map (λ d' => w - 1 - d')).sum + ds.sum) := by
              simp [Nat.add_assoc, Nat.add_comm, Nat.add_left_comm]
        _ = (w - 1) + ((ds.map (λ d' => w - 1 - d')).sum + ds.sum) := by rw [hsub]
        _ = (w - 1) + (ds.length * (w - 1)) := by rw [h_ih]
    rw [h_all]
    simp [show (d :: ds).length = ds.length + 1 by simp, Nat.succ_mul, Nat.add_comm]

/- `Forall₂ (≤) (map f dig2) (map f dig1)` helper for the antitone lemma -/
private theorem Forall₂_map_checksum_rev {dig1 dig2 : List Nat} {w : Nat}
    (hLE : Forall₂ (· ≤ ·) dig1 dig2)
    (hBound1 : ∀ d ∈ dig1, d < w) (hBound2 : ∀ d ∈ dig2, d < w) :
    Forall₂ (· ≤ ·) (dig2.map (λ d => w - 1 - d)) (dig1.map (λ d => w - 1 - d)) := by
  match dig1, dig2, hLE with
  | [], [], .nil => exact .nil
  | a::as, b::bs, .cons hd htl =>
    have ha_lt_w : a < w := hBound1 a (by simp)
    have hb_lt_w : b < w := hBound2 b (by simp)
    have h_rev : (w - 1 - b) ≤ (w - 1 - a) := by omega
    have h_tail := Forall₂_map_checksum_rev htl
      (λ d hd' => hBound1 d (by simp [hd']))
      (λ d hd' => hBound2 d (by simp [hd']))
    simp
    exact .cons h_rev h_tail

theorem wotsChecksumValue_antitone {dig1 dig2 : List Nat} {w : Nat}
    (hLE : Forall₂ (· ≤ ·) dig1 dig2)
    (hBound1 : ∀ d ∈ dig1, d < w) (hBound2 : ∀ d ∈ dig2, d < w) :
    wotsChecksumValue w dig2 ≤ wotsChecksumValue w dig1 := by
  rw [wotsChecksumValue, wotsChecksumValue]
  exact (Forall₂_map_checksum_rev hLE hBound1 hBound2).sum_le

theorem wotsChecksum_eq_imp_sum_eq {dig1 dig2 : List Nat} {w : Nat}
    (hLE : Forall₂ (· ≤ ·) dig1 dig2)
    (hBound1 : ∀ d ∈ dig1, d < w) (hBound2 : ∀ d ∈ dig2, d < w)
    (hCsumEq : wotsChecksumValue w dig1 = wotsChecksumValue w dig2) :
    dig1.sum = dig2.sum := by
  have hLenEq : dig1.length = dig2.length := hLE.length_eq
  have hIdent1 := wotsChecksumValue_add_sum_eq w dig1 hBound1
  have hIdent2 := wotsChecksumValue_add_sum_eq w dig2 hBound2
  rw [hLenEq] at hIdent1
  rw [hCsumEq] at hIdent1
  omega

/-! ### Main security theorem -/

theorem wots_fullDigits_pointwiseLE_imp_dig_eq
    {dig1 dig2 : List Nat} {w l1 l2 : Nat}
    (hw : 0 < w)
    (hLen1 : dig1.length = l1) (hLen2 : dig2.length = l1)
    (hBound1 : ∀ d ∈ dig1, d < w) (hBound2 : ∀ d ∈ dig2, d < w)
    (hL2suff : l1 * (w - 1) < w ^ l2)
    (hLE : Forall₂ (· ≤ ·)
      (wotsFullDigits dig1 w l1 l2) (wotsFullDigits dig2 w l1 l2)) :
    dig1 = dig2 := by
  let csum1 := wotsChecksumValue w dig1
  let csum2 := wotsChecksumValue w dig2
  let cs1 := digitsOfBaseW csum1 w l2
  let cs2 := digitsOfBaseW csum2 w l2

  have hFull1 : wotsFullDigits dig1 w l1 l2 = dig1 ++ cs1 := by
    simp [wotsFullDigits, cs1, csum1]
  have hFull2 : wotsFullDigits dig2 w l1 l2 = dig2 ++ cs2 := by
    simp [wotsFullDigits, cs2, csum2]
  rw [hFull1, hFull2] at hLE

  have hlen_prefix : dig1.length = dig2.length := by rw [hLen1, hLen2]
  have h_split := hLE.append_inv hlen_prefix
  rcases h_split with ⟨hMsgLE, hcsLE⟩

  -- Step 1: checksum is antitonic in message digits
  have hCsumGE : csum2 ≤ csum1 :=
    wotsChecksumValue_antitone hMsgLE hBound1 hBound2

  -- Step 2: from cs1 ≤ cs2 pointwise, deduce csum1 ≤ csum2
  have hCsumLE : csum1 ≤ csum2 := by
    have hC1 : csum1 < w ^ l2 := by
      have hc1 := wotsChecksumValue_le hLen1 hBound1
      exact Nat.lt_of_le_of_lt hc1 hL2suff
    have hC2 : csum2 < w ^ l2 := by
      have hc2 := wotsChecksumValue_le hLen2 hBound2
      exact Nat.lt_of_le_of_lt hc2 hL2suff
    exact digitsOfBaseW_pointwiseLE_imp_le hw hC1 hC2 hcsLE

  -- Step 3: therefore checksums equal
  have hCsumEq : csum1 = csum2 := Nat.le_antisymm hCsumLE hCsumGE

  -- Step 4: equal checksums + pointwise ≤ → equal sums
  have hSumEq : dig1.sum = dig2.sum :=
    wotsChecksum_eq_imp_sum_eq hMsgLE hBound1 hBound2 hCsumEq

  -- Step 5: pointwise ≤ + equal sums → equal lists
  exact hMsgLE.eq_of_sum_eq hSumEq

theorem wots_fullDigits_incomparable
    {dig1 dig2 : List Nat} {w l1 l2 : Nat}
    (hw : 0 < w)
    (hLen1 : dig1.length = l1) (hLen2 : dig2.length = l1)
    (hBound1 : ∀ d ∈ dig1, d < w) (hBound2 : ∀ d ∈ dig2, d < w)
    (hL2suff : l1 * (w - 1) < w ^ l2)
    (hNeq : dig1 ≠ dig2) :
    ¬ Forall₂ (· ≤ ·) (wotsFullDigits dig1 w l1 l2) (wotsFullDigits dig2 w l1 l2) ∧
    ¬ Forall₂ (· ≤ ·) (wotsFullDigits dig2 w l1 l2) (wotsFullDigits dig1 w l1 l2) := by
  have hNot1 : ¬ Forall₂ (· ≤ ·)
    (wotsFullDigits dig1 w l1 l2) (wotsFullDigits dig2 w l1 l2) := by
    intro h
    have := wots_fullDigits_pointwiseLE_imp_dig_eq hw hLen1 hLen2 hBound1 hBound2 hL2suff h
    exact hNeq this
  have hNot2 : ¬ Forall₂ (· ≤ ·)
    (wotsFullDigits dig2 w l1 l2) (wotsFullDigits dig1 w l1 l2) := by
    intro h
    have := wots_fullDigits_pointwiseLE_imp_dig_eq hw hLen2 hLen1 hBound2 hBound1 hL2suff h
    exact hNeq this.symm
  exact And.intro hNot1 hNot2

end SphincsMinus
