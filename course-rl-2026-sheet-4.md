---
layout: default
title: "Exercise Sheet 4"
description: "Exercise Sheet 4 for Advanced Probabilistic Methods Related to Reinforcement Learning (TU Berlin, Winter 2026/27): raising a Bernoulli mean, explore-then-commit by Bretagnolle–Huber, and arms whose distributions have infinite relative entropy."
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

**Exercise 4.1 (raising a Bernoulli mean).** <span class="tag">used later</span> <span class="used-in">in <a href="course-rl-2026-lecture-4.html#remark-4-6">Remark 4.6</a></span> Let $$\mathcal M = \{\mathrm{Ber}(x) : x \in [0,1]\}$$, and let $$d^\eta$$ be as in [Definition 4.3](course-rl-2026-lecture-4.html#definition-4-3).
{: #exercise-4-1}

(a) For $$p, q \in [0,1]$$, let $$\mathrm{kl}(p,q) = \mathrm{KL}(\mathrm{Ber}(p) \,\Vert\, \mathrm{Ber}(q))$$. Show that $$\mathrm{kl}(p,q) \ge 2(p-q)^2$$. (*Hint:* the case $$q \in \{0,1\}$$ is immediate. Otherwise fix $$p$$, differentiate $$\mathrm{kl}(p,q) - 2(p-q)^2$$ in $$q$$, and use $$q(1-q) \le 1/4$$.)

(b) Deduce that $$2\eta^2 \le d^\eta \le \eta\log\frac{1+\eta}{1-\eta}$$ for $$\eta \in (0,1)$$, and show that $$d^\eta = \infty$$ for $$\eta \ge 1$$. (*Hint:* for the upper bound, take $$p = (1-\eta)/2$$ and let $$q \downarrow (1+\eta)/2$$.)

(c) Let $$\nu = (\mathrm{Ber}(0.95), \mathrm{Ber}(0.9))$$, so that $$\Delta_2 = 0.05$$. Compute the constant $$d_2$$ of [Theorem 4.1](course-rl-2026-lecture-4.html#theorem-4-1) numerically ([Remark 3.12](course-rl-2026-lecture-3.html#remark-3-12)(2) gives $$d_2 = \mathrm{kl}(0.9, 0.95)$$), and compare it with the bounds on $$d^{\Delta_2}$$ from (b).

(d) [Theorem 4.1](course-rl-2026-lecture-4.html#theorem-4-1) for this $$\nu$$ involves $$d_2$$, which depends on where the means lie in $$[0,1]$$, while [Theorem 4.4](course-rl-2026-lecture-4.html#theorem-4-4) involves only $$d^{2\Delta}$$, an infimum over all pairs of means. Explain in a sentence why a worst-case bound cannot see that arms with means close to 1 are easier to tell apart.

**Exercise 4.2 (ETC needs $$n^{2/3}$$, by Bretagnolle–Huber).** Fix $$\sigma > 0$$ and $$\Delta \in (0, \sigma]$$, and consider the two 2-armed Gaussian environments $$\nu = (N(\Delta/2, \sigma^2), N(-\Delta/2, \sigma^2))$$ and $$\nu' = (N(-\Delta/2, \sigma^2), N(\Delta/2, \sigma^2))$$.
{: #exercise-4-2}

(a) Show that the arm to which $$\mathrm{ETC}(\ell)$$ commits depends only on the first $$2\ell$$ rounds, and that the laws of these rounds under $$\nu$$ and $$\nu'$$ have relative entropy $$\ell\Delta^2/\sigma^2$$.

(b) Use [Theorem 3.4](course-rl-2026-lecture-3.html#theorem-3-4) to show that, in $$\nu$$ or in $$\nu'$$, $$\mathrm{ETC}(\ell)$$ commits to the suboptimal arm with probability at least $$e^{-\ell\Delta^2/\sigma^2}/4$$.

(c) Deduce that for every $$n \ge 4$$ and every $$\ell \le n/4$$, there are $$\Delta \in (0, \sigma]$$ and an environment $$\nu$$ or $$\nu'$$ in which $$R_n(\mathrm{ETC}(\ell)) \ge c\,\sigma n^{2/3}$$, for a constant $$c > 0$$ that does not depend on $$n$$, $$\ell$$ or $$\sigma$$. Compare with [Exercise 2.2(b)](course-rl-2026-sheet-2.html#exercise-2-2), which used the normal distribution directly.

**Exercise 4.3 (when the relative entropy is infinite).** Let $$\mathcal M = \{\mathrm{Uniform}[m, m+1] : m \in [0,1]\}$$, so that the mean of $$\mathrm{Uniform}[m,m+1]$$ is $$m + \frac12$$.
{: #exercise-4-3}

(a) Show that $$\mathrm{KL}(\mu \,\Vert\, \mu') = \infty$$ for distinct $$\mu, \mu' \in \mathcal M$$. So $$d^\eta = \infty$$ for every $$\eta > 0$$, and [Theorem 4.4](course-rl-2026-lecture-4.html#theorem-4-4) gives nothing, although the means of $$\mathcal M$$ form an interval.

(b) Let $$X_1, \dots, X_N$$ be i.i.d. $$\mathrm{Uniform}[m, m+1]$$. Show that the mean $$m + \frac12$$ lies, with certainty, in $$[\max_i X_i - \frac12,\ \min_i X_i + \frac12]$$, and that $$\mathbb P(\min_i X_i - m \ge x) = \mathbb P(m + 1 - \max_i X_i \ge x) = (1-x)^N$$ for $$x \in [0,1]$$.

(c) Consider the following policy. Initially all arms are *active*. In each *phase*, play every active arm once; at the end of the phase, deactivate every active arm whose upper bound $$\min + \frac12$$ (over its rewards so far) is below the lower bound $$\max - \frac12$$ of some other active arm. Once a single arm is active, play that arm until the horizon. Show that an optimal arm is never deactivated, and that an arm $$b$$ with $$\Delta_b > 0$$ is still active after $$r$$ phases with probability at most $$2e^{-r\Delta_b/2}$$. Deduce that $$\mathbb E_\nu[N_b(n)] \le 1 + 4/\Delta_b$$. (*Hint:* if $$b$$ is still active, then the upper bound of $$b$$ minus its mean, plus the mean of an optimal arm minus that arm's lower bound, is at least $$\Delta_b$$.)

(d) Conclude that the policy $$\pi$$ of (c) satisfies $$R_n(\pi,\nu) \le 5(K-1)$$ for every $$\nu \in \mathcal M^K$$ and every $$n$$. Why does this not contradict [Theorem 4.1](course-rl-2026-lecture-4.html#theorem-4-1)?

<nav class="notes-nav" aria-label="Course notes"><a href="course-rl-2026-lecture-4.html">Lecture 4 notes</a><a href="course-rl-2026-results.html">Results so far</a><a href="course-rl-2026.html">Course page</a></nav>
