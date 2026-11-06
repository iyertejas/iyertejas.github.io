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

Two exercises use *Pinsker's inequality*, which we have not proved yet: for probability measures $$P$$ and $$Q$$ on a common space and every event $$A$$, $$\vert P(A) - Q(A)\vert \le \sqrt{\mathrm{KL}(P \,\Vert\, Q)/2}$$. For Bernoulli measures it gives $$\mathrm{kl}(p,q) \ge 2(p-q)^2$$, where $$\mathrm{kl}(p,q) = \mathrm{KL}(\mathrm{Ber}(p) \,\Vert\, \mathrm{Ber}(q))$$.

Please report any errors or unclear points, in the lecture or by email.
{: .note}

**Exercise 4.1 (raising a Bernoulli mean).** <span class="tag">used later</span> <span class="used-in">in <a href="course-rl-2026-lecture-4.html#remark-4-6">Remark 4.6</a></span> Let $$\mathcal M = \{\mathrm{Ber}(x) : x \in [0,1]\}$$, and let $$d^\eta$$ be as in [Definition 4.3](course-rl-2026-lecture-4.html#definition-4-3).
{: #exercise-4-1}

(a) Show that $$2\eta^2 \le d^\eta \le \eta\log\frac{1+\eta}{1-\eta}$$ for $$\eta \in (0,1)$$, and that $$d^\eta = \infty$$ for $$\eta \ge 1$$. (*Hint:* for the lower bound, use Pinsker's inequality; for the upper bound, take $$p = (1-\eta)/2$$ and let $$q \downarrow (1+\eta)/2$$.)

(b) Let $$\nu = (\mathrm{Ber}(0.95), \mathrm{Ber}(0.9))$$, so that $$\Delta_2 = 0.05$$. Compute the constant $$d_2$$ of [Theorem 4.1](course-rl-2026-lecture-4.html#theorem-4-1) numerically ([Remark 3.12](course-rl-2026-lecture-3.html#remark-3-12)(2) gives $$d_2 = \mathrm{kl}(0.9, 0.95)$$), and compare it with the bounds on $$d^{\Delta_2}$$ from (a).

(c) [Theorem 4.1](course-rl-2026-lecture-4.html#theorem-4-1) for this $$\nu$$ involves $$d_2$$, which depends on where the means lie in $$[0,1]$$, while [Theorem 4.4](course-rl-2026-lecture-4.html#theorem-4-4) involves only $$d^{2\Delta}$$, an infimum over all pairs of means. Explain in a sentence why a worst-case bound cannot see that arms with means close to 1 are easier to tell apart.

**Exercise 4.2 (ETC needs $$n^{2/3}$$, by Bretagnolle–Huber).** Fix $$\sigma > 0$$ and $$\Delta \in (0, \sigma]$$, and consider the two 2-armed Gaussian environments $$\nu = (N(\Delta/2, \sigma^2), N(-\Delta/2, \sigma^2))$$ and $$\nu' = (N(-\Delta/2, \sigma^2), N(\Delta/2, \sigma^2))$$.
{: #exercise-4-2}

(a) Show that the arm to which $$\mathrm{ETC}(\ell)$$ commits depends only on the first $$2\ell$$ rounds, and that the laws of these rounds under $$\nu$$ and $$\nu'$$ have relative entropy $$\ell\Delta^2/\sigma^2$$.

(b) Use [Theorem 3.4](course-rl-2026-lecture-3.html#theorem-3-4) to show that, in $$\nu$$ or in $$\nu'$$, $$\mathrm{ETC}(\ell)$$ commits to the suboptimal arm with probability at least $$e^{-\ell\Delta^2/\sigma^2}/4$$.

(c) Deduce that for every $$n \ge 4$$ and every $$\ell \le n/4$$, there are $$\Delta \in (0, \sigma]$$ and an environment $$\nu$$ or $$\nu'$$ in which $$R_n(\mathrm{ETC}(\ell)) \ge c\,\sigma n^{2/3}$$, for a constant $$c > 0$$ that does not depend on $$n$$, $$\ell$$ or $$\sigma$$. Compare with [Exercise 2.2(b)](course-rl-2026-sheet-2.html#exercise-2-2), which used the normal distribution directly.

**Exercise 4.3 (a hard prior).** For a probability measure $$\rho$$ (a *prior*) on a class $$\mathcal E$$ of environments, the *Bayesian regret* of $$\pi$$ is $$\int R_n(\pi,\nu)\,\rho(d\nu)$$; Lecture 6 studies it.
{: #exercise-4-3}

(a) Show that the Bayesian regret is at most $$\sup_{\nu \in \mathcal E} R_n(\pi,\nu)$$.

(b) Let $$K = 2$$ and $$\mathcal M = \{N(m,\sigma^2) : m \in \mathbb R\}$$. Take $$\nu$$ and $$\nu'$$ as in the proof of [Theorem 4.4](course-rl-2026-lecture-4.html#theorem-4-4) (with $$K = 2$$, the arm $$a' = 2$$ is forced), and put prior mass $$1/2$$ on each. Show that every policy has Bayesian regret at least $$c\sigma\sqrt n$$ under this prior, with an explicit $$c > 0$$.

(c) For $$K \ge 3$$, why does the same argument not give a prior under which every policy has Bayesian regret of order $$\sigma\sqrt{Kn}$$?

(d) Let $$K \ge 2$$, $$\Delta > 0$$, $$\mu_0 = N(0,\sigma^2)$$ and $$\mu' = N(\Delta,\sigma^2)$$. For $$j \in [K]$$, let $$\nu_j$$ be the environment in which arm $$j$$ has law $$\mu'$$ and every other arm has law $$\mu_0$$, let $$\rho$$ be uniform on $$\{\nu_1, \dots, \nu_K\}$$, and let $$\nu_0$$ have every arm with law $$\mu_0$$. Using Pinsker's inequality for each of the events $$\{A_t = j\}$$, and [Lemma 3.6](course-rl-2026-lecture-3.html#lemma-3-6), show that

$$
\mathbb E_{\nu_j}[N_j(n)] \le \mathbb E_{\nu_0}[N_j(n)] + n\sqrt{\mathbb E_{\nu_0}[N_j(n)]\,\Delta^2/(4\sigma^2)}.
$$

Average over $$j$$, and choose $$\Delta$$, to show that every policy has Bayesian regret at least $$(\sigma/8)\sqrt{Kn}$$ under $$\rho$$. (*Hint:* $$\sum_j \mathbb E_{\nu_0}[N_j(n)] = n$$, and Cauchy–Schwarz.) Compare the constant with [Remark 4.6](course-rl-2026-lecture-4.html#remark-4-6)(1).

**Exercise 4.4 (a flawed proof).** The following "simplification" of the proof of [Theorem 4.4](course-rl-2026-lecture-4.html#theorem-4-4), for Gaussian arms with variance $$\sigma^2$$, is wrong.
{: #exercise-4-4}

> *Run $$\pi$$ in $$\nu = (N(\Delta,\sigma^2), N(0,\sigma^2), \dots, N(0,\sigma^2))$$, and let $$I$$ be the arm $$a \ge 2$$ with the fewest pulls, so that $$N_I(n) \le n/(K-1)$$ surely, not just in expectation. Let $$\nu'$$ raise arm $$I$$ to mean $$2\Delta$$. Then $$\mathrm{KL}(\mathbb P_\nu \,\Vert\, \mathbb P_{\nu'}) = N_I(n) \cdot 2\Delta^2/\sigma^2 \le 1/2$$ for a suitable $$\Delta$$, and the proof concludes as before.*

(a) Find two errors.

(b) Why does the actual proof choose $$a'$$ using expectations?

**Exercise 4.5 (when the relative entropy is infinite).** Let $$\mathcal M = \{\mathrm{Uniform}[m, m+1] : m \in [0,1]\}$$, so that the mean of $$\mathrm{Uniform}[m,m+1]$$ is $$m + \frac12$$.
{: #exercise-4-5}

(a) Show that $$\mathrm{KL}(\mu \,\Vert\, \mu') = \infty$$ for distinct $$\mu, \mu' \in \mathcal M$$. So $$d^\eta = \infty$$ for every $$\eta > 0$$, and [Theorem 4.4](course-rl-2026-lecture-4.html#theorem-4-4) gives nothing, although the means of $$\mathcal M$$ form an interval.

(b) Let $$X_1, \dots, X_N$$ be i.i.d. $$\mathrm{Uniform}[m, m+1]$$. Show that the mean $$m + \frac12$$ lies, with certainty, in $$[\max_i X_i - \frac12,\ \min_i X_i + \frac12]$$, and that $$\mathbb P(\min_i X_i - m \ge x) = \mathbb P(m + 1 - \max_i X_i \ge x) = (1-x)^N$$ for $$x \in [0,1]$$.

(c) Consider the following policy. Initially all arms are *active*. In each *phase*, play every active arm once; at the end of the phase, deactivate every active arm whose upper bound $$\min + \frac12$$ (over its rewards so far) is below the lower bound $$\max - \frac12$$ of some other active arm. Once a single arm is active, play that arm until the horizon. Show that an optimal arm is never deactivated, and that an arm $$b$$ with $$\Delta_b > 0$$ is still active after $$r$$ phases with probability at most $$2e^{-r\Delta_b/2}$$. Deduce that $$\mathbb E_\nu[N_b(n)] \le 1 + 4/\Delta_b$$. (*Hint:* if $$b$$ is still active, then the upper bound of $$b$$ minus its mean, plus the mean of an optimal arm minus that arm's lower bound, is at least $$\Delta_b$$.)

(d) Conclude that $$R_n(\pi,\nu) \le 5(K-1)$$ for every $$\nu \in \mathcal M^K$$ and every $$n$$. Why does this not contradict [Theorem 4.1](course-rl-2026-lecture-4.html#theorem-4-1)?

<nav class="notes-nav" aria-label="Course notes"><a href="course-rl-2026-lecture-4.html">Lecture 4 notes</a><a href="course-rl-2026-results.html">Results so far</a><a href="course-rl-2026.html">Course page</a></nav>
