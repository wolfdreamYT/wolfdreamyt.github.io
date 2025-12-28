import gmpy2
from gmpy2 import mpz, mpfr
import sys
import math

# -------- CONFIG --------
DIGITS = 1_000_000_000       
CHUNK_SIZE = 100_000      
OUTPUT_FILE = "pi_1B_[WOLFSTUDIOS].txt"
# ------------------------

gmpy2.get_context().precision = int(DIGITS * math.log2(10)) + 10

def chudnovsky_bs(a, b):
    if b - a == 1:
        if a == 0:
            return mpz(1), mpz(13591409), mpz(1)
        a = mpz(a)
        P = (6*a-5)*(2*a-1)*(6*a-1)
        Q = a*a*a * 26680
        T = P * (13591409 + 545140134*a)
        if a % 2:
            T = -T
        return P, Q, T
    else:
        m = (a + b) // 2
        P1, Q1, T1 = chudnovsky_bs(a, m)
        P2, Q2, T2 = chudnovsky_bs(m, b)
        return (
            P1 * P2,
            Q1 * Q2,
            T1 * Q2 + T2 * P1
        )

def compute_pi():
    terms = DIGITS // 14 + 1
    P, Q, T = chudnovsky_bs(0, terms)
    pi = (mpfr(426880) * gmpy2.sqrt(10005) * Q) / T
    return pi

print("Computing π...")
pi = compute_pi()

print("Writing digits to disk...")
pi_str = str(pi)

with open(OUTPUT_FILE, "w") as f:
    f.write("3.\n")
    digits = pi_str.split(".")[1]

    for i in range(0, len(digits), CHUNK_SIZE):
        f.write(digits[i:i+CHUNK_SIZE])
        f.write("\n")

print("Done. π has been successfully built.")
