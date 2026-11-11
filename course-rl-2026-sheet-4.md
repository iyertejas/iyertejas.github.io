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

Notation as in the [Lecture 4 notes](course-rl-2026-lecture-4.html). Exercises marked <span class="tag">used later</span> are needed in later lectures. Click *Solution* under an exercise to reveal its solution.

Please report any errors or unclear points, in the lecture or by email.
{: .note}

**Exercise 4.1 (raising a Bernoulli mean).** <span class="tag">used later</span> <span class="used-in">in <a href="course-rl-2026-lecture-4.html#remark-4-6">Remark 4.6</a></span> Let $$\mathcal M = \{\mathrm{Ber}(x) : x \in [0,1]\}$$, and let $$d^\eta$$ be as in [Definition 4.3](course-rl-2026-lecture-4.html#definition-4-3).
{: #exercise-4-1}

(a) For $$p, q \in [0,1]$$, let $$\mathrm{kl}(p,q) = \mathrm{KL}(\mathrm{Ber}(p) \,\Vert\, \mathrm{Ber}(q))$$. Show that $$\mathrm{kl}(p,q) \ge 2(p-q)^2$$. (*Hint:* the case $$q \in \{0,1\}$$ is immediate. Otherwise fix $$p$$, differentiate $$\mathrm{kl}(p,q) - 2(p-q)^2$$ in $$q$$, and use $$q(1-q) \le 1/4$$.)

(b) Deduce that $$2\eta^2 \le d^\eta \le \eta\log\frac{1+\eta}{1-\eta}$$ for $$\eta \in (0,1)$$, and show that $$d^\eta = \infty$$ for $$\eta \ge 1$$. (*Hint:* for the upper bound, take $$p = (1-\eta)/2$$ and let $$q \downarrow (1+\eta)/2$$.)

(c) Let $$\nu = (\mathrm{Ber}(0.95), \mathrm{Ber}(0.9))$$, so that $$\Delta_2 = 0.05$$. Compute the constant $$d_2$$ of [Theorem 4.1](course-rl-2026-lecture-4.html#theorem-4-1) numerically ([Remark 3.12](course-rl-2026-lecture-3.html#remark-3-12)(1) gives $$d_2 = \mathrm{kl}(0.9, 0.95)$$), and compare it with the bounds on $$d^{\Delta_2}$$ from (b).

(d) [Theorem 4.1](course-rl-2026-lecture-4.html#theorem-4-1) for this $$\nu$$ involves $$d_2$$, which depends on where the means lie in $$[0,1]$$, while [Theorem 4.4](course-rl-2026-lecture-4.html#theorem-4-4) involves only $$d^{2\Delta}$$, an infimum over all pairs of means. Explain in a sentence why a worst-case bound cannot see that arms with means close to 1 are easier to tell apart.

<details class="solution" markdown="1">
<summary>Solution</summary>

(a) If $$q \in \{0, 1\}$$, then either $$p = q$$ and both sides vanish, or $$p \ne q$$ and $$\mathrm{kl}(p,q) = \infty$$. Otherwise fix $$p$$ and let $$g(q) = \mathrm{kl}(p,q) - 2(p-q)^2$$ for $$q \in (0,1)$$. Then

$$
g'(q) = -\frac pq + \frac{1-p}{1-q} + 4(p - q) = (q - p)\Big(\frac{1}{q(1-q)} - 4\Big),
$$

and $$q(1-q) \le 1/4$$, so $$g' \le 0$$ on $$(0, p]$$ and $$g' \ge 0$$ on $$[p, 1)$$. Hence $$g(q) \ge g(p) = 0$$.

(b) If $$q > p + \eta$$, then $$\mathrm{kl}(p,q) \ge 2(q-p)^2 > 2\eta^2$$ by (a), so $$d^\eta \ge 2\eta^2$$. For the upper bound let $$p = (1-\eta)/2$$. Every $$q \in ((1+\eta)/2, 1)$$ has $$q > p + \eta$$, so $$d^\eta \le \mathrm{kl}(p, q)$$, and $$q \mapsto \mathrm{kl}(p,q)$$ is continuous on $$(0,1)$$. Letting $$q \downarrow (1+\eta)/2$$,

$$
d^\eta \le \mathrm{kl}\Big(\frac{1-\eta}2, \frac{1+\eta}2\Big) = \frac{1-\eta}2\log\frac{1-\eta}{1+\eta} + \frac{1+\eta}2\log\frac{1+\eta}{1-\eta} = \eta\log\frac{1+\eta}{1-\eta}.
$$

If $$\eta \ge 1$$, no $$p, q \in [0,1]$$ have $$q > p + \eta$$, so the infimum is over the empty set and $$d^\eta = \infty$$.

(c) $$d_2 = \mathrm{kl}(0.9, 0.95) = 0.9\log\frac{0.9}{0.95} + 0.1\log 2 \approx 0.0207$$, while (b) gives $$0.005 = 2\Delta_2^2 \le d^{\Delta_2} \le \Delta_2\log\frac{1.05}{0.95} \approx 0.005004$$. So $$d_2$$ is about four times $$d^{\Delta_2}$$. The worst pairs with gap $$0.05$$ sit near $$\frac12$$, e.g. $$\mathrm{kl}(0.475, 0.525) \approx 0.0050$$, where the Bernoulli variance is largest.

(d) A worst-case bound must hold for every environment with the given gap, including those whose means sit where arms are hardest to tell apart.

</details>

**Exercise 4.2 (ETC needs $$n^{2/3}$$, by Bretagnolle–Huber).** Fix $$\sigma > 0$$ and $$\Delta \in (0, \sigma]$$, and consider the two 2-armed Gaussian environments $$\nu = (N(\Delta/2, \sigma^2), N(-\Delta/2, \sigma^2))$$ and $$\nu' = (N(-\Delta/2, \sigma^2), N(\Delta/2, \sigma^2))$$.
{: #exercise-4-2}

(a) Show that the arm to which $$\mathrm{ETC}(\ell)$$ commits depends only on the first $$2\ell$$ rounds, and that the laws of these rounds under $$\nu$$ and $$\nu'$$ have relative entropy $$\ell\Delta^2/\sigma^2$$.

(b) Use [Theorem 3.4](course-rl-2026-lecture-3.html#theorem-3-4) to show that, in $$\nu$$ or in $$\nu'$$, $$\mathrm{ETC}(\ell)$$ commits to the suboptimal arm with probability at least $$e^{-\ell\Delta^2/\sigma^2}/4$$.

(c) Deduce that for every $$n \ge 4$$ and every $$\ell \le n/4$$, there are $$\Delta \in (0, \sigma]$$ and an environment $$\nu$$ or $$\nu'$$ in which $$R_n(\mathrm{ETC}(\ell)) \ge c\,\sigma n^{2/3}$$, for a constant $$c > 0$$ that does not depend on $$n$$, $$\ell$$ or $$\sigma$$. Compare with [Exercise 2.2(b)](course-rl-2026-sheet-2.html#exercise-2-2), which used the normal distribution directly.

<details class="solution" markdown="1">
<summary>Solution</summary>

(a) In rounds $$1, \dots, 2\ell$$, $$\mathrm{ETC}(\ell)$$ plays the arms in a fixed order, whatever the rewards, and $$\hat A$$ is a function of the empirical means after round $$2\ell$$, so of the history $$H_{2\ell}$$. Let $$P$$ and $$P'$$ be the laws of $$H_{2\ell}$$ under $$\nu$$ and $$\nu'$$. Each arm is played exactly $$\ell$$ times by round $$2\ell$$, so by [Lemma 3.6](course-rl-2026-lecture-3.html#lemma-3-6) with horizon $$2\ell$$ and [Example 3.3](course-rl-2026-lecture-3.html#example-3-3),

$$
\mathrm{KL}(P \,\Vert\, P') = \ell\, \mathrm{KL}\big(N(\tfrac\Delta2, \sigma^2) \,\Vert\, N(-\tfrac\Delta2, \sigma^2)\big) + \ell\, \mathrm{KL}\big(N(-\tfrac\Delta2, \sigma^2) \,\Vert\, N(\tfrac\Delta2, \sigma^2)\big) = 2\ell \cdot \frac{\Delta^2}{2\sigma^2} = \frac{\ell\Delta^2}{\sigma^2}.
$$

(b) Let $$A = \{\hat A = 2\}$$. Arm 1 is optimal in $$\nu$$ and arm 2 in $$\nu'$$, so $$\mathrm{ETC}(\ell)$$ commits to the suboptimal arm with probability $$P(A)$$ in $$\nu$$ and $$P'(A^c)$$ in $$\nu'$$. By [Theorem 3.4](course-rl-2026-lecture-3.html#theorem-3-4) and (a), $$P(A) + P'(A^c) \ge \frac12 e^{-\ell\Delta^2/\sigma^2}$$, so one of the two is at least $$\frac14 e^{-\ell\Delta^2/\sigma^2}$$.

(c) In both environments the suboptimal arm is played $$\ell$$ times while exploring, so $$R_n \ge \ell\Delta$$. In the environment of (b), committing to the suboptimal arm costs $$(n - 2\ell)\Delta \ge \frac n2 \Delta$$, as $$\ell \le n/4$$, so there $$R_n \ge \frac n8 \Delta\, e^{-\ell\Delta^2/\sigma^2}$$.

If $$\ell \ge n^{2/3}$$, take $$\Delta = \sigma$$: then $$R_n \ge \sigma\ell \ge \sigma n^{2/3}$$. If $$\ell < n^{2/3}$$, take $$\Delta = \sigma n^{-1/3} \le \sigma$$: then $$\ell\Delta^2/\sigma^2 < 1$$ and $$R_n \ge \frac n8\, \sigma n^{-1/3} e^{-1} = \sigma n^{2/3}/(8e)$$. So $$c = 1/(8e)$$ works.

[Exercise 2.2(b)](course-rl-2026-sheet-2.html#exercise-2-2) computed the Gaussian tail exactly and got a better constant. Here only the relative entropy between the two environments enters, so the same argument works for any class of rewards in which it can be computed.

</details>

**Exercise 4.3 (when the relative entropy is infinite).** Let $$\mathcal M = \{\mathrm{Uniform}[m, m+1] : m \in [0,1]\}$$, so that the mean of $$\mathrm{Uniform}[m,m+1]$$ is $$m + \frac12$$.
{: #exercise-4-3}

(a) Show that $$\mathrm{KL}(\mu \,\Vert\, \mu') = \infty$$ for distinct $$\mu, \mu' \in \mathcal M$$. So $$d^\eta = \infty$$ for every $$\eta > 0$$, and [Theorem 4.4](course-rl-2026-lecture-4.html#theorem-4-4) gives nothing, although the means of $$\mathcal M$$ form an interval.

(b) Let $$X_1, \dots, X_N$$ be i.i.d. $$\mathrm{Uniform}[m, m+1]$$. Show that the mean $$m + \frac12$$ lies, with certainty, in $$[\max_i X_i - \frac12,\ \min_i X_i + \frac12]$$, and that $$\mathbb P(\min_i X_i - m \ge x) = \mathbb P(m + 1 - \max_i X_i \ge x) = (1-x)^N$$ for $$x \in [0,1]$$.

(c) Consider the following policy. Initially all arms are *active*. In each *phase*, play every active arm once. Write $$X_{b,s}$$ for the $$s$$-th reward from arm $$b$$, and after $$r$$ phases set $$U_b(r) = \min_{s \le r} X_{b,s} + \frac12$$ and $$L_b(r) = \max_{s \le r} X_{b,s} - \frac12$$ for every arm $$b$$ still active. At the end of phase $$r$$, deactivate every active arm $$b$$ with $$U_b(r) < L_{b'}(r)$$ for some other active arm $$b'$$. Once a single arm is active, play that arm until the horizon. Show that an optimal arm is never deactivated, and that an arm $$b$$ with $$\Delta_b > 0$$ is still active after $$r$$ phases with probability at most $$2e^{-r\Delta_b/2}$$. Deduce that $$\mathbb E_\nu[N_b(n)] \le 1 + 4/\Delta_b$$. (*Hint:* if $$b$$ is still active after $$r$$ phases and $$a^*$$ is an optimal arm, then $$(U_b(r) - m_b) + (m_{a^*} - L_{a^*}(r)) \ge \Delta_b$$.)

(d) Conclude that the policy $$\pi$$ of (c) satisfies $$R_n(\pi,\nu) \le 5(K-1)$$ for every $$\nu \in \mathcal M^K$$ and every $$n$$. Why does this not contradict [Theorem 4.1](course-rl-2026-lecture-4.html#theorem-4-1)?

<details class="solution" markdown="1">
<summary>Solution</summary>

(a) Let $$\mu = \mathrm{Uniform}[m, m+1]$$ and $$\mu' = \mathrm{Uniform}[m', m'+1]$$ with $$m \ne m'$$. Then $$[m, m+1] \setminus [m', m'+1]$$ is an interval of length $$\lvert m - m'\rvert > 0$$, with positive $$\mu$$-measure and zero $$\mu'$$-measure. So $$\mu \not\ll \mu'$$ and $$\mathrm{KL}(\mu \,\Vert\, \mu') = \infty$$. Every pair in the definition of $$d^\eta$$ has distinct means, so $$d^\eta = \infty$$, while the means form the interval $$[\frac12, \frac32]$$.

(b) Each $$X_i \in [m, m+1]$$, so $$\max_i X_i - \frac12 \le m + \frac12 \le \min_i X_i + \frac12$$. The $$X_i - m$$ are i.i.d. uniform on $$[0,1]$$, and so are the $$m + 1 - X_i$$. Hence, for $$x \in [0,1]$$, $$\mathbb P(\min_i X_i - m \ge x) = \prod_i \mathbb P(X_i - m \ge x) = (1-x)^N$$, and likewise for $$m + 1 - \max_i X_i$$.

(c) Let arm $$b$$ have law $$\mathrm{Uniform}[c_b, c_b + 1]$$, so $$m_b = c_b + \frac12$$, and let $$X_{b,s}$$ be its $$s$$-th reward. After $$r$$ phases, as on the sheet, $$U_b(r) := \min_{s \le r} X_{b,s} + \frac12$$ and $$L_b(r) := \max_{s \le r} X_{b,s} - \frac12$$ for every arm $$b$$ still active. By (b), $$L_b(r) \le m_b \le U_b(r)$$. Let $$a^*$$ be an optimal arm. For every other arm $$b$$ active after $$r$$ phases, $$L_b(r) \le m_b \le m_{a^*} \le U_{a^*}(r)$$, so $$U_{a^*}(r)$$ is never below a lower bound and $$a^*$$ is never deactivated.

Let $$\Delta_b > 0$$, and suppose $$b$$ is still active after $$r \ge 1$$ phases. Then $$b$$ and $$a^*$$ were active in all $$r$$ phases, so both have $$r$$ rewards, and $$b$$ survived the end of phase $$r$$, so $$U_b(r) \ge L_{a^*}(r)$$. Hence

$$
\big(U_b(r) - m_b\big) + \big(m_{a^*} - L_{a^*}(r)\big) = U_b(r) - L_{a^*}(r) + \Delta_b \ge \Delta_b,
$$

so $$U_b(r) - m_b \ge \Delta_b/2$$ or $$m_{a^*} - L_{a^*}(r) \ge \Delta_b/2$$. By (b), applied to $$X_{b,1}, \dots, X_{b,r}$$ and to $$X_{a^*,1}, \dots, X_{a^*,r}$$ with $$x = \Delta_b/2 \le \frac12$$, each has probability $$(1 - \Delta_b/2)^r \le e^{-r\Delta_b/2}$$ (using the inequality $$1 - x \le e^{-x}$$), which gives the bound $$2e^{-r\Delta_b/2}$$. Arm $$b$$ is played once in phase $$r + 1$$ if it is active after $$r$$ phases, and never after the phases end, since $$a^*$$ is then the only active arm. So

$$
\mathbb E_\nu[N_b(n)] \le \sum_{r \ge 0} \mathbb P(b \text{ active after } r \text{ phases}) \le 1 + \sum_{r \ge 1} 2e^{-r\Delta_b/2} = 1 + \frac{2}{e^{\Delta_b/2} - 1} \le 1 + \frac{4}{\Delta_b},
$$

using $$e^x - 1 \ge x$$.

(d) By [Lemma 1.6](course-rl-2026-lecture-1.html#lemma-1-6) and (c), $$R_n(\pi, \nu) = \sum_{b : \Delta_b > 0} \Delta_b\, \mathbb E_\nu[N_b(n)] \le \sum_{b : \Delta_b > 0} (\Delta_b + 4) \le 5(K-1)$$, since $$\Delta_b \le 1$$ and at least one arm is optimal. There is no contradiction with [Theorem 4.1](course-rl-2026-lecture-4.html#theorem-4-1): by (a), $$d_b = \infty$$ for every arm, so there the lower bound reads $$\liminf_n \mathbb E_\nu[N_b(n)]/\log n \ge 0$$.

</details>

<nav class="notes-nav" aria-label="Course notes"><a href="course-rl-2026-lecture-4.html">Lecture 4 notes</a><a href="course-rl-2026-sheet-5.html">Exercise Sheet 5 →</a><a href="course-rl-2026-results.html">Results so far</a><a href="course-rl-2026.html">Course page</a></nav>
