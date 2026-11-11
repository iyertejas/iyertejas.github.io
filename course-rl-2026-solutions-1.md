---
layout: default
title: "Solutions to Exercise Sheet 1"
description: "Solutions to Exercise Sheet 1 for Advanced Probabilistic Methods Related to Reinforcement Learning (TU Berlin, Winter 2026/27)."
nav: "teaching"
body_class: "course notes"
math: true
---
# Solutions to Exercise Sheet 1

[Advanced Probabilistic Methods Related to Reinforcement Learning](course-rl-2026.html) · TU Berlin · Winter 2026/27
{: .lede}

Solutions to [Exercise Sheet 1](course-rl-2026-sheet-1.html). Notation as in the [Lecture 1 notes](course-rl-2026-lecture-1.html).

Please report any errors or unclear points, in the lecture or by email.
{: .note}

**[Exercise 1](course-rl-2026-sheet-1.html#exercise-1).** All four parts use [Lemma 1.6](course-rl-2026-lecture-1.html#lemma-1-6), $$R_n = \sum_a \Delta_a\, \mathbb E[N_a(n)]$$.
{: #exercise-1}

(a) $$N_a(n) = n$$ and $$N_b(n) = 0$$ for $$b \ne a$$, so $$R_n = n\Delta_a$$.

(b) $$\mathbb P(A_t = a) = 1/K$$ for every $$t$$, so $$\mathbb E[N_a(n)] = n/K$$ and $$R_n = \frac nK \sum_a \Delta_a$$.

(c) $$N_1(n) = N_2(n) = n/2$$, so $$R_n = \frac n2(\Delta_1 + \Delta_2) = \frac n2 \lvert m_1 - m_2\rvert$$.

(d) Not in every environment. The policy of (a) has $$R_n = 0$$ when $$a$$ is optimal, but $$R_n = n\Delta_a$$ otherwise; (b) and (c) have regret linear in $$n$$ unless all arms have the same mean.

**[Exercise 2](course-rl-2026-sheet-1.html#exercise-2).**
{: #exercise-2}

(a) $$cX$$ has mean $$cm$$, and $$\mathbb E[e^{\lambda(cX - cm)}] = \mathbb E[e^{(\lambda c)(X - m)}] \le e^{\lambda^2 c^2\sigma^2/2}$$ for every $$\lambda$$.

(b) With means $$m_1, m_2$$, independence gives

$$
\mathbb E\big[e^{\lambda(X_1 + X_2 - m_1 - m_2)}\big] = \mathbb E\big[e^{\lambda(X_1 - m_1)}\big]\, \mathbb E\big[e^{\lambda(X_2 - m_2)}\big] \le e^{\lambda^2(\sigma_1^2 + \sigma_2^2)/2}.
$$

(c) Let $$X_1 = X_2 = Z \sim N(0, 1)$$, both $$1$$-sub-Gaussian. Then $$X_1 + X_2 = 2Z$$ and $$\mathbb E[e^{2\lambda Z}] = e^{2\lambda^2} > e^{\lambda^2} = e^{\lambda^2 (\sqrt2)^2/2}$$ for $$\lambda \ne 0$$, so $$2Z$$ is not $$\sqrt2$$-sub-Gaussian.

**[Exercise 3](course-rl-2026-sheet-1.html#exercise-3).**
{: #exercise-3}

(a) Let $$p = -a/(b - a) \in [0, 1]$$ and write $$F(\lambda) = (1 - p)e^{\lambda a} + p\, e^{\lambda b} > 0$$ for the left-hand side. Subtract the logarithms of the two sides:

$$
\psi(\lambda) = \frac{\lambda^2 (b - a)^2}{8} - \log F(\lambda).
$$

Then $$\psi(0) = 0$$, and it suffices to show that $$\psi$$ is minimised at $$\lambda = 0$$. With $$q(\lambda) = p\, e^{\lambda b}/F(\lambda) \in [0, 1]$$,

$$
(\log F)'(\lambda) = a + (b - a)\, q(\lambda), \qquad (\log F)''(\lambda) = (b - a)^2\, q(\lambda)\big(1 - q(\lambda)\big) \le \frac{(b - a)^2}{4}.
$$

So $$\psi'(0) = -(a + (b - a)p) = 0$$ and $$\psi'' \ge 0$$: $$\psi$$ is convex with a critical point at $$0$$, hence minimised there.

(b) If $$a = b$$ there is nothing to prove. Otherwise $$Y = X - m$$ takes values in $$[a', b'] = [a - m, b - m]$$, where $$a' \le 0 \le b'$$ since $$a \le m \le b$$, and $$b' - a' = b - a > 0$$. Each $$y \in [a', b']$$ is the convex combination $$y = \theta(y)\, a' + (1 - \theta(y))\, b'$$ with $$\theta(y) = (b' - y)/(b' - a') \in [0, 1]$$, so by convexity of $$y \mapsto e^{\lambda y}$$,

$$
e^{\lambda y} \le \theta(y)\, e^{\lambda a'} + \big(1 - \theta(y)\big)\, e^{\lambda b'}.
$$

Put $$y = Y$$ and take expectations. Since $$\mathbb E[Y] = 0$$, we have $$\mathbb E[\theta(Y)] = b'/(b' - a')$$ and $$\mathbb E[1 - \theta(Y)] = -a'/(b' - a')$$, so by (a) with $$a', b'$$ in place of $$a, b$$,

$$
\mathbb E\big[e^{\lambda Y}\big] \le \frac{b'\, e^{\lambda a'} - a'\, e^{\lambda b'}}{b' - a'} \le e^{\lambda^2 (b - a)^2/8} = e^{\lambda^2 ((b - a)/2)^2/2}.
$$

**[Exercise 4](course-rl-2026-sheet-1.html#exercise-4).**
{: #exercise-4}

(a) By [Exercise 2(a)](course-rl-2026-sheet-1.html#exercise-2) with $$c = -1$$, the $$-X_i$$ are independent, $$\sigma$$-sub-Gaussian with mean $$-m$$, and their empirical mean is $$-\hat m_s$$. The upper tail of [Theorem 1.10](course-rl-2026-lecture-1.html#theorem-1-10) applied to them gives $$\mathbb P(-\hat m_s + m \ge \varepsilon) \le e^{-s\varepsilon^2/(2\sigma^2)}$$, which is the claim.

(b) By the union bound, then the upper tail of [Theorem 1.10](course-rl-2026-lecture-1.html#theorem-1-10) and (a),

$$
\mathbb P(\lvert\hat m_s - m\rvert \ge \varepsilon) \le \mathbb P(\hat m_s - m \ge \varepsilon) + \mathbb P(\hat m_s - m \le -\varepsilon) \le 2 e^{-s\varepsilon^2/(2\sigma^2)}.
$$

**[Exercise 5](course-rl-2026-sheet-1.html#exercise-5).** $$\hat m_s - m = (\sigma/\sqrt s)\, Z$$ with $$Z$$ standard normal, so $$\mathbb P(\hat m_s - m \ge \varepsilon) = \mathbb P(Z > z_s)$$ with $$z_s = \varepsilon\sqrt s/\sigma \to \infty$$. Since $$\log\varphi(z) = -z^2/2 - \frac12\log(2\pi)$$, the two bounds of the hint give
{: #exercise-5}

$$
-\frac{z_s^2}{2} - \log\frac{1 + z_s^2}{z_s} - \tfrac12\log(2\pi) \le \log \mathbb P(Z > z_s) \le -\frac{z_s^2}{2} - \log z_s - \tfrac12\log(2\pi).
$$

Divide by $$s$$: $$z_s^2/(2s) = \varepsilon^2/(2\sigma^2)$$, and the remaining terms are $$O(\log s)$$, so they vanish after division by $$s$$.

**[Exercise 6](course-rl-2026-sheet-1.html#exercise-6).**
{: #exercise-6}

(a) Put $$\varepsilon = \sqrt{2\sigma^2\log(2/\delta)/s}$$, so that $$2e^{-s\varepsilon^2/(2\sigma^2)} = \delta$$. By [Exercise 4(b)](#exercise-4), $$\mathbb P(\lvert\hat m_s - m\rvert \ge \varepsilon) \le \delta$$; take complements.

(b) Rewards in $$[0, 1]$$ are $$\frac12$$-sub-Gaussian ([Lemma 1.9(b)](course-rl-2026-lecture-1.html#lemma-1-9)). With $$\delta = 0.05$$, (a) asks for $$\sqrt{\log(40)/(2s)} \le 0.05$$, that is, $$s \ge \log(40)/0.005 \approx 737.8$$. So $$s = 738$$ samples are enough.

(c) By [Exercise 4(b)](#exercise-4) for each arm and a union bound over the $$K$$ arms (which needs no independence between arms), the probability is at most $$2K e^{-s\varepsilon^2/(2\sigma^2)}$$. This is at most $$\delta$$ once $$s \ge \frac{2\sigma^2}{\varepsilon^2}\log\frac{2K}{\delta}$$: $$s$$ only has to grow like $$\log K$$.

**[Exercise 7](course-rl-2026-sheet-1.html#exercise-7).**
{: #exercise-7}

(a) False: "the number of pulls is independent of the reward values" (and with it, that the rewards from arm $$a$$, given $$N_a(n)$$, are i.i.d. with mean $$m_a$$). Take $$n = 2$$, arm 1 with law $$\mathrm{Ber}(\frac12)$$, and the policy that plays arm 1 in round 1, and in round 2 plays arm 1 again if $$X_1 = 1$$ and arm 2 otherwise. Then $$N_1(2) = 1 + X_1$$ depends on $$X_1$$, and given $$N_1(2) = 1$$ the only reward from arm 1 is $$0$$, not a draw with mean $$\frac12$$.

(b) Yes. Let $$Y_{a,s}$$ be the $$s$$-th reward from arm $$a$$ (the reward table of [Lecture 2, Definition 2.2](course-rl-2026-lecture-2.html#definition-2-2)). The event $$\{N_a(n) \ge s\}$$, that the $$s$$-th pull of $$a$$ happens by round $$n$$, is decided before $$Y_{a,s}$$ is used, and is independent of it. So

$$
\mathbb E\Big[\sum_{t : A_t = a} X_t\Big] = \sum_{s=1}^n \mathbb E\big[Y_{a,s}\, \mathbf 1\{N_a(n) \ge s\}\big] = m_a \sum_{s=1}^n \mathbb P(N_a(n) \ge s) = m_a\, \mathbb E[N_a(n)].
$$

**[Exercise 8](course-rl-2026-sheet-1.html#exercise-8).**
{: #exercise-8}

(a) By induction, $$A_1, X_1, \dots, A_{t-1}, X_{t-1}$$ are functions of $$Y_1, \dots, Y_{t-1}, U_1, \dots, U_{t-1}$$, so $$(H_{t-1}, A_t)$$ is a function of $$Y_1, \dots, Y_{t-1}, U_1, \dots, U_t$$, which are independent of $$Y_t$$. Hence, for measurable $$B$$, $$\mathbb P(X_t \in B \mid H_{t-1}, A_t) = \mathbb P(Y_{t,a} \in B)\big\vert_{a = A_t} = \mu_{A_t}(B)$$.

(b) By (a), $$\mathbb E[X_t \mid A_t] = m_{A_t}$$, so $$\mathbb E[X_t] = \sum_a m_a\, \mathbb P(A_t = a)$$. Summing over $$t$$ gives $$\mathbb E[\sum_t X_t] = \sum_a m_a\, \mathbb E[N_a(n)]$$, and the rest is as in the proof of [Lemma 1.6](course-rl-2026-lecture-1.html#lemma-1-6).

(c) In general neither. With $$K = 2$$, arm 1 non-degenerate, and the policy from the [solution to Exercise 7(a)](#exercise-7) above, $$A_2$$ depends on $$X_1 = Y_{1,1}$$, so it is independent of neither $$X_1$$ nor $$Y_1$$. (A policy that ignores the rewards, such as playing the arms in turn, gives an $$A_t$$ independent of both.)

<nav class="notes-nav" aria-label="Course notes"><a href="course-rl-2026-sheet-1.html">Exercise Sheet 1</a><a href="course-rl-2026-lecture-1.html">Lecture 1 notes</a><a href="course-rl-2026-results.html">Results so far</a><a href="course-rl-2026.html">Course page</a></nav>
