---
layout: default
title: "Exercise Sheet 4"
description: "Exercise Sheet 4 for Advanced Probabilistic Methods Related to Reinforcement Learning (TU Berlin, Winter 2026/27): raising a Bernoulli mean, explore-then-commit by Bretagnolle–Huber, a hard prior, a flawed proof, and arms whose distributions have infinite relative entropy."
nav: "teaching"
body_class: "course notes"
math: true
---
# Exercise Sheet 4

[Advanced Probabilistic Methods Related to Reinforcement Learning](course-rl-2026.html) · TU Berlin · Winter 2026/27
{: .lede}

Notation as in the [Lecture 4 notes](course-rl-2026-lecture-4.html). Exercises marked <span class="tag">used later</span> are needed in later lectures.

Please report any errors or unclear points, in the lecture or by email.
{: .note}

**Exercise 4.1 (raising a Bernoulli mean).** <span class="tag">used later</span> <span class="used-in">in <a href="course-rl-2026-lecture-4.html#remark-4-5">Remark 4.5</a></span> Let $$\mathcal M = \{\mathrm{Ber}(x) : x \in [0,1]\}$$ and $$\mathrm{kl}(p,q) = \mathrm{KL}(\mathrm{Ber}(p) \,\Vert\, \mathrm{Ber}(q))$$.
{: #exercise-4-1}

(a) Show that $$2\eta^2 \le d^\eta \le \eta\log\frac{1+\eta}{1-\eta}$$ for $$\eta \in (0,1)$$, and that $$d^\eta = \infty$$ for $$\eta \ge 1$$. (*Hint:* for the lower bound, use Pinsker's inequality for Bernoulli measures, $$\mathrm{kl}(p,q) \ge 2(p-q)^2$$; for the upper bound, take $$p = (1-\eta)/2$$ and let $$q \downarrow (1+\eta)/2$$.)

(b) Let $$\nu = (\mathrm{Ber}(0.95), \mathrm{Ber}(0.9))$$. Compute $$d_2$$ numerically and compare it with $$d^{\Delta_2}$$.

(c) Lai–Robbins for this $$\nu$$ involves $$d_2$$, while [Theorem 4.3](course-rl-2026-lecture-4.html#theorem-4-3) involves $$d^{2\Delta}$$. Explain in a sentence why a worst-case bound cannot see that arms with means close to 1 are easier to tell apart.

**Exercise 4.2 (ETC needs $$n^{2/3}$$, by Bretagnolle–Huber).** Consider two Gaussian arms with unit variance and means $$\pm\Delta/2$$, in either order.
{: #exercise-4-2}

(a) Show that the decision of $$\mathrm{ETC}(\ell)$$ depends only on the first $$2\ell$$ rounds, and that the laws of these rounds under the two orders have KL divergence $$\ell\Delta^2$$.

(b) Use [Theorem 3.4](course-rl-2026-lecture-3.html#theorem-3-4) to show that $$\mathrm{ETC}(\ell)$$ commits to the wrong arm in one of the two environments with probability at least $$e^{-\ell\Delta^2}/4$$.

(c) Deduce that for every fixed $$\ell \le n/4$$, the supremum over $$\Delta \in (0,1]$$ of $$R_n(\mathrm{ETC}(\ell))$$ is at least $$c\,n^{2/3}$$ for a constant $$c > 0$$. Compare with [Exercise 2.2(b)](course-rl-2026-sheet-2.html#exercise-2-2), which used the normal distribution directly.

**Exercise 4.3 (a hard prior).** For a prior $$\rho$$ on a class $$\mathcal E$$ of environments, the *Bayesian regret* of $$\pi$$ is $$\int R_n(\pi,\nu)\,\rho(d\nu)$$; Lecture 6 studies it.
{: #exercise-4-3}

(a) Show that the Bayesian regret is at most $$\sup_{\nu \in \mathcal E} R_n(\pi,\nu)$$.

(b) Let $$K = 2$$ and $$\mathcal M = \{N(m,\sigma^2) : m \in \mathbb R\}$$. Take $$\nu$$ and $$\nu'$$ as in the proof of [Theorem 4.3](course-rl-2026-lecture-4.html#theorem-4-3) (with $$K = 2$$, the arm $$a' = 2$$ is forced), and put prior mass $$1/2$$ on each. Show that every policy has Bayesian regret at least $$c\sigma\sqrt n$$ under this prior, with an explicit $$c > 0$$.

(c) For $$K \ge 3$$, why does the same argument not give a prior under which every policy has Bayesian regret of order $$\sigma\sqrt{Kn}$$?

(d) Let $$\mu_0 = N(0,\sigma^2)$$ and $$\mu' = N(\Delta,\sigma^2)$$. For $$j \in [K]$$, let $$\nu_j$$ be the environment in which arm $$j$$ has law $$\mu'$$ and every other arm has law $$\mu_0$$, let $$\rho$$ be uniform on $$\{\nu_1, \dots, \nu_K\}$$, and let $$\nu_0$$ have every arm with law $$\mu_0$$. Pinsker's inequality states that $$\vert P(A) - Q(A)\vert \le \sqrt{\mathrm{KL}(P \,\Vert\, Q)/2}$$ for probability measures $$P, Q$$ and every event $$A$$. Using it and [Lemma 3.6](course-rl-2026-lecture-3.html#lemma-3-6) for each of the events $$\{A_t = j\}$$, show that

$$
\mathbb E_{\nu_j}[N_j(n)] \le \mathbb E_{\nu_0}[N_j(n)] + n\sqrt{\mathbb E_{\nu_0}[N_j(n)]\,\Delta^2/(4\sigma^2)}.
$$

Average over $$j$$, and choose $$\Delta$$, to show that every policy has Bayesian regret at least $$(\sigma/8)\sqrt{Kn}$$ under $$\rho$$. (*Hint:* $$\sum_j \mathbb E_{\nu_0}[N_j(n)] = n$$, and Cauchy–Schwarz.) Compare the constant with [Remark 4.5](course-rl-2026-lecture-4.html#remark-4-5)(1).

**Exercise 4.4 (a flawed proof).** The following "simplification" of the proof of [Theorem 4.3](course-rl-2026-lecture-4.html#theorem-4-3), for Gaussian arms with unit variance, is wrong.
{: #exercise-4-4}

> *Run $$\pi$$ in $$\nu = (N(\Delta,1), N(0,1), \dots, N(0,1))$$, and let $$I$$ be the arm $$a \ge 2$$ with the fewest pulls, so that $$N_I(n) \le n/(K-1)$$ surely, not just in expectation. Let $$\nu'$$ raise arm $$I$$ to mean $$2\Delta$$. Then $$\mathrm{KL}(\mathbb P_\nu \,\Vert\, \mathbb P_{\nu'}) = N_I(n) \cdot 2\Delta^2 \le 1/2$$, and the proof concludes as before.*

(a) Find two errors.

(b) Why does the actual proof choose $$a'$$ using expectations?

**Exercise 4.5 (when the KL is infinite).** Let $$\mathcal M = \{\mathrm{Uniform}[m, m+1] : m \in [0,1]\}$$, so that the mean of $$\mathrm{Uniform}[m,m+1]$$ is $$m + \frac12$$.
{: #exercise-4-5}

(a) Show that $$\mathrm{KL}(\mu \,\Vert\, \mu') = \infty$$ for distinct $$\mu, \mu' \in \mathcal M$$. So $$d^\eta = \infty$$ for every $$\eta > 0$$, and [Theorem 4.3](course-rl-2026-lecture-4.html#theorem-4-3) gives nothing, although the means of $$\mathcal M$$ form an interval.

(b) Let $$X_1, \dots, X_N$$ be i.i.d. $$\mathrm{Uniform}[m, m+1]$$. Show that the mean $$m + \frac12$$ lies, with certainty, in $$[\max_i X_i - \frac12,\ \min_i X_i + \frac12]$$, and that $$\mathbb P(\min_i X_i - m \ge x) = (1-x)^N$$ for $$x \in [0,1]$$.

(c) Consider the policy that plays the active arms in turn, one phase at a time (initially all arms are active), and at the end of each phase deactivates every arm whose upper bound $$\min + \frac12$$ is below the lower bound $$\max - \frac12$$ of some active arm; once a single arm is active, it plays that arm. Show that an optimal arm is never deactivated, and that an arm $$b$$ with $$\Delta_b > 0$$ is still active after $$r$$ phases with probability at most $$2e^{-r\Delta_b/2}$$. Deduce that $$\mathbb E_\nu[N_b(n)] \le 1 + 4/\Delta_b$$. (*Hint:* if $$b$$ is still active, then the upper bound of $$b$$ minus its mean, plus the mean of an optimal arm minus that arm's lower bound, is at least $$\Delta_b$$.)

(d) Conclude that $$R_n(\pi,\nu) \le 5(K-1)$$ for every $$\nu \in \mathcal M^K$$ and every $$n$$. Why does this not contradict Lai–Robbins?

<nav class="notes-nav" aria-label="Course notes"><a href="course-rl-2026-lecture-4.html">Lecture 4 notes</a><a href="course-rl-2026-results.html">Results so far</a><a href="course-rl-2026.html">Course page</a></nav>
