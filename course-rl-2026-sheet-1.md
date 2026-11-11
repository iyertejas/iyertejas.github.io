---
layout: default
title: "Exercise Sheet 1"
description: "Exercise Sheet 1 for Advanced Probabilistic Methods Related to Reinforcement Learning (TU Berlin, Winter 2026/27): regret, sub-Gaussian random variables and the Chernoff bound."
nav: "teaching"
body_class: "course notes"
math: true
---
# Exercise Sheet 1

[Advanced Probabilistic Methods Related to Reinforcement Learning](course-rl-2026.html) · TU Berlin · Winter 2026/27
{: .lede}

Notation as in the [Lecture 1 notes](course-rl-2026-lecture-1.html). Exercises marked <span class="tag">used later</span> are needed in later lectures. Click *Solution* under an exercise to reveal its solution.

Please report any errors or unclear points, in the lecture or by email.
{: .note}

**Exercise 1 (regret of simple policies).** Fix a $$K$$-armed SBM.
{: #exercise-1}

(a) Show that the policy that always plays arm $$a$$ has regret $$R_n = n\Delta_a$$.

(b) Show that the policy that plays a uniformly random arm in every round has regret $$R_n = \frac nK \sum_a \Delta_a$$.

(c) Let $$K = 2$$ and $$n$$ be even. Compute the regret of the policy that plays arm 1 in rounds $$1, \dots, n/2$$ and arm 2 in rounds $$n/2 + 1, \dots, n$$.

(d) Do any of these policies have regret that grows more slowly than $$n$$?

<details class="solution" markdown="1">
<summary>Solution</summary>

All four parts use [Lemma 1.6](course-rl-2026-lecture-1.html#lemma-1-6), $$R_n = \sum_a \Delta_a\, \mathbb E[N_a(n)]$$.


(a) $$N_a(n) = n$$ and $$N_b(n) = 0$$ for $$b \ne a$$, so $$R_n = n\Delta_a$$.

(b) $$\mathbb P(A_t = a) = 1/K$$ for every $$t$$, so $$\mathbb E[N_a(n)] = n/K$$ and $$R_n = \frac nK \sum_a \Delta_a$$.

(c) $$N_1(n) = N_2(n) = n/2$$, so $$R_n = \frac n2(\Delta_1 + \Delta_2) = \frac n2 \lvert m_1 - m_2\rvert$$.

(d) Not in every environment. The policy of (a) has $$R_n = 0$$ when $$a$$ is optimal, but $$R_n = n\Delta_a$$ otherwise; (b) and (c) have regret linear in $$n$$ unless all arms have the same mean.

</details>

**Exercise 2 (scaling and sums).** <span class="tag">used later</span> <span class="used-in">in <a href="course-rl-2026-lecture-1.html#lemma-1-9">Lemma 1.9</a></span>
{: #exercise-2}

(a) Show that if $$X$$ is $$\sigma$$-sub-Gaussian and $$c \in \mathbb R$$, then $$cX$$ is $$\lvert c\rvert\sigma$$-sub-Gaussian.

(b) Show that if $$X_1$$ and $$X_2$$ are independent, $$X_1$$ is $$\sigma_1$$-sub-Gaussian and $$X_2$$ is $$\sigma_2$$-sub-Gaussian, then $$X_1 + X_2$$ is $$\sqrt{\sigma_1^2 + \sigma_2^2}$$-sub-Gaussian.

(c) Show by an example that the conclusion of (b) can fail if $$X_1$$ and $$X_2$$ are not independent.

<details class="solution" markdown="1">
<summary>Solution</summary>

(a) $$cX$$ has mean $$cm$$, and $$\mathbb E[e^{\lambda(cX - cm)}] = \mathbb E[e^{(\lambda c)(X - m)}] \le e^{\lambda^2 c^2\sigma^2/2}$$ for every $$\lambda$$.

(b) With means $$m_1, m_2$$, independence gives

$$
\mathbb E\big[e^{\lambda(X_1 + X_2 - m_1 - m_2)}\big] = \mathbb E\big[e^{\lambda(X_1 - m_1)}\big]\, \mathbb E\big[e^{\lambda(X_2 - m_2)}\big] \le e^{\lambda^2(\sigma_1^2 + \sigma_2^2)/2}.
$$

(c) Let $$X_1 = X_2 = Z \sim N(0, 1)$$, both $$1$$-sub-Gaussian. Then $$X_1 + X_2 = 2Z$$ and $$\mathbb E[e^{2\lambda Z}] = e^{2\lambda^2} > e^{\lambda^2} = e^{\lambda^2 (\sqrt2)^2/2}$$ for $$\lambda \ne 0$$, so $$2Z$$ is not $$\sqrt2$$-sub-Gaussian.

</details>

**Exercise 3 (Hoeffding's lemma).** <span class="tag">used later</span> <span class="used-in">in <a href="course-rl-2026-lecture-1.html#lemma-1-9">Lemma 1.9</a></span>
{: #exercise-3}

(a) Let $$a \le 0 \le b$$ with $$a < b$$. Show that for every $$\lambda \in \mathbb R$$,

$$
\frac{b\, e^{\lambda a} - a\, e^{\lambda b}}{b - a} \le e^{\lambda^2 (b - a)^2 / 8}.
$$

*Hint:* fix $$a$$ and $$b$$, and show that the difference between the two sides is minimised at $$\lambda = 0$$.

(b) Hence prove Hoeffding's lemma: if $$X \in [a, b]$$ almost surely, with mean $$m$$, then $$X$$ is $$\frac{b-a}{2}$$-sub-Gaussian.

*Hint:* reduce to $$m = 0$$, and use convexity of $$x \mapsto e^{\lambda x}$$.

<details class="solution" markdown="1">
<summary>Solution</summary>

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

</details>

**Exercise 4 (the lower tail).** <span class="tag">used later</span> <span class="used-in">in <a href="course-rl-2026-lecture-1.html#theorem-1-10">Theorem 1.10</a>; <a href="course-rl-2026-lecture-2.html#5-ucb">Lecture 2, Section 5</a></span> Under the assumptions of [Theorem 1.10](course-rl-2026-lecture-1.html#theorem-1-10):
{: #exercise-4}

(a) Show that $$\mathbb P(\hat m_s - m \le -\varepsilon) \le \exp\big(-\frac{s\varepsilon^2}{2\sigma^2}\big)$$ for every $$\varepsilon \ge 0$$.

(b) Deduce that $$\mathbb P(\lvert\hat m_s - m\rvert \ge \varepsilon) \le 2 \exp\big(-\frac{s\varepsilon^2}{2\sigma^2}\big)$$.

<details class="solution" markdown="1">
<summary>Solution</summary>

(a) By [Exercise 2(a)](#exercise-2) with $$c = -1$$, the $$-X_i$$ are independent, $$\sigma$$-sub-Gaussian with mean $$-m$$, and their empirical mean is $$-\hat m_s$$. The upper tail of [Theorem 1.10](course-rl-2026-lecture-1.html#theorem-1-10) applied to them gives $$\mathbb P(-\hat m_s + m \ge \varepsilon) \le e^{-s\varepsilon^2/(2\sigma^2)}$$, which is the claim.

(b) By the union bound, then the upper tail of [Theorem 1.10](course-rl-2026-lecture-1.html#theorem-1-10) and (a),

$$
\mathbb P(\lvert\hat m_s - m\rvert \ge \varepsilon) \le \mathbb P(\hat m_s - m \ge \varepsilon) + \mathbb P(\hat m_s - m \le -\varepsilon) \le 2 e^{-s\varepsilon^2/(2\sigma^2)}.
$$

</details>

**Exercise 5 (the Chernoff exponent is sharp for Gaussians).** Let $$X_1, \dots, X_s$$ be independent $$N(m, \sigma^2)$$ random variables and $$\hat m_s = \frac1s \sum_i X_i$$. Show that for every $$\varepsilon > 0$$,
{: #exercise-5}

$$
\lim_{s \to \infty} \frac1s \log \mathbb P(\hat m_s - m \ge \varepsilon) = -\frac{\varepsilon^2}{2\sigma^2}.
$$

*Hint:* $$\hat m_s - m \sim N(0, \sigma^2/s)$$. For a standard normal $$Z$$ with density $$\varphi$$, use that $$\frac{z}{1 + z^2}\, \varphi(z) \le \mathbb P(Z > z) \le \frac{\varphi(z)}{z}$$ for $$z > 0$$.

<details class="solution" markdown="1">
<summary>Solution</summary>

$$\hat m_s - m = (\sigma/\sqrt s)\, Z$$ with $$Z$$ standard normal, so $$\mathbb P(\hat m_s - m \ge \varepsilon) = \mathbb P(Z > z_s)$$ with $$z_s = \varepsilon\sqrt s/\sigma \to \infty$$. Since $$\log\varphi(z) = -z^2/2 - \frac12\log(2\pi)$$, the two bounds of the hint give


$$
-\frac{z_s^2}{2} - \log\frac{1 + z_s^2}{z_s} - \tfrac12\log(2\pi) \le \log \mathbb P(Z > z_s) \le -\frac{z_s^2}{2} - \log z_s - \tfrac12\log(2\pi).
$$

Divide by $$s$$: $$z_s^2/(2s) = \varepsilon^2/(2\sigma^2)$$, and the remaining terms are $$O(\log s)$$, so they vanish after division by $$s$$.

</details>

**Exercise 6 (how many samples?).**
{: #exercise-6}

(a) Under the assumptions of [Theorem 1.10](course-rl-2026-lecture-1.html#theorem-1-10), show that with probability at least $$1 - \delta$$,

$$
\lvert\hat m_s - m\rvert < \sqrt{\frac{2\sigma^2 \log(2/\delta)}{s}}.
$$

(b) Rewards take values in $$[0, 1]$$. How many independent samples are enough to guarantee that the empirical mean is within 0.05 of the true mean with probability at least 0.95?

(c) There are $$K$$ arms, and each is sampled $$s$$ times, independently. Show that the probability that at least one empirical mean is at distance $$\varepsilon$$ or more from its true mean is at most $$2K \exp\big(-\frac{s\varepsilon^2}{2\sigma^2}\big)$$. How must $$s$$ grow with $$K$$ to keep this probability below a fixed $$\delta$$?

<details class="solution" markdown="1">
<summary>Solution</summary>

(a) Put $$\varepsilon = \sqrt{2\sigma^2\log(2/\delta)/s}$$, so that $$2e^{-s\varepsilon^2/(2\sigma^2)} = \delta$$. By [Exercise 4(b)](#exercise-4), $$\mathbb P(\lvert\hat m_s - m\rvert \ge \varepsilon) \le \delta$$; take complements.

(b) Rewards in $$[0, 1]$$ are $$\frac12$$-sub-Gaussian ([Lemma 1.9(b)](course-rl-2026-lecture-1.html#lemma-1-9)). With $$\delta = 0.05$$, (a) asks for $$\sqrt{\log(40)/(2s)} \le 0.05$$, that is, $$s \ge \log(40)/0.005 \approx 737.8$$. So $$s = 738$$ samples are enough.

(c) By [Exercise 4(b)](#exercise-4) for each arm and a union bound over the $$K$$ arms (which needs no independence between arms), the probability is at most $$2K e^{-s\varepsilon^2/(2\sigma^2)}$$. This is at most $$\delta$$ once $$s \ge \frac{2\sigma^2}{\varepsilon^2}\log\frac{2K}{\delta}$$: $$s$$ only has to grow like $$\log K$$.

</details>

**Exercise 7 (Find the flaw).** The following proof of [Lemma 1.6](course-rl-2026-lecture-1.html#lemma-1-6) was written by a (by now probably defunct) AI model. Its conclusion is correct; its argument is not.
{: #exercise-7}

> *Proof.* Group the rewards by arm: $$\sum_t X_t = \sum_a \sum_{t : A_t = a} X_t$$. The rewards obtained from arm $$a$$ are i.i.d. with mean $$m_a$$, and there are $$N_a(n)$$ of them. Since the number of pulls is independent of the reward values, the expected sum of $$N_a(n)$$ i.i.d. variables with mean $$m_a$$ is $$m_a \mathbb E[N_a(n)]$$. Hence $$\mathbb E\big[\sum_t X_t\big] = \sum_a m_a \mathbb E[N_a(n)]$$, and the claim follows from $$n = \sum_a N_a(n)$$.

(a) Which sentence is false for policies that adapt to the data? Give a two-armed example where it fails.

(b) Can the argument be repaired without the false claim? (*Hint:* when is the $$s$$-th reward from arm $$a$$ drawn, compared with the decision to pull arm $$a$$ for the $$s$$-th time?)

<details class="solution" markdown="1">
<summary>Solution</summary>

(a) False: "the number of pulls is independent of the reward values" (and with it, that the rewards from arm $$a$$, given $$N_a(n)$$, are i.i.d. with mean $$m_a$$). Take $$n = 2$$, arm 1 with law $$\mathrm{Ber}(\frac12)$$, and the policy that plays arm 1 in round 1, and in round 2 plays arm 1 again if $$X_1 = 1$$ and arm 2 otherwise. Then $$N_1(2) = 1 + X_1$$ depends on $$X_1$$, and given $$N_1(2) = 1$$ the only reward from arm 1 is $$0$$, not a draw with mean $$\frac12$$.

(b) Yes. Let $$Y_{a,s}$$ be the $$s$$-th reward from arm $$a$$ (the reward table of [Lecture 2, Definition 2.2](course-rl-2026-lecture-2.html#definition-2-2)). The event $$\{N_a(n) \ge s\}$$, that the $$s$$-th pull of $$a$$ happens by round $$n$$, is decided before $$Y_{a,s}$$ is used, and is independent of it. So

$$
\mathbb E\Big[\sum_{t : A_t = a} X_t\Big] = \sum_{s=1}^n \mathbb E\big[Y_{a,s}\, \mathbf 1\{N_a(n) \ge s\}\big] = m_a \sum_{s=1}^n \mathbb P(N_a(n) \ge s) = m_a\, \mathbb E[N_a(n)].
$$

</details>

**Exercise 8 (potential rewards).** <span class="tag">used later</span> <span class="used-in">in <a href="course-rl-2026-lecture-2.html#definition-2-1">Definition 2.1</a></span> Let $$Y_1, Y_2, \dots$$ be independent random vectors $$Y_t = (Y_{t,1}, \dots, Y_{t,K})$$ with $$Y_{t,a} \sim \mu_a$$, and let $$U_1, U_2, \dots$$ be independent uniform random variables, independent of the $$Y$$'s. Any policy can be run by setting $$A_t = f_t(A_1, X_1, \dots, A_{t-1}, X_{t-1}, U_t)$$ for suitable functions $$f_t$$. Set $$X_t = Y_{t,A_t}$$.
{: #exercise-8}

(a) Note that $$A_t$$ is independent of $$Y_t$$, and deduce that $$\mathbb P(X_t \in \cdot \mid H_{t-1}, A_t) = \mu_{A_t}$$.

(b) Use (a) to give a short proof of [Lemma 1.6](course-rl-2026-lecture-1.html#lemma-1-6).

(c) Is $$A_t$$ independent of $$Y_{t-1}$$? Of $$X_{t-1}$$? Give a policy for which it is not.

<details class="solution" markdown="1">
<summary>Solution</summary>

(a) By induction, $$A_1, X_1, \dots, A_{t-1}, X_{t-1}$$ are functions of $$Y_1, \dots, Y_{t-1}, U_1, \dots, U_{t-1}$$, so $$(H_{t-1}, A_t)$$ is a function of $$Y_1, \dots, Y_{t-1}, U_1, \dots, U_t$$, which are independent of $$Y_t$$. Hence, for measurable $$B$$, $$\mathbb P(X_t \in B \mid H_{t-1}, A_t) = \mathbb P(Y_{t,a} \in B)\big\vert_{a = A_t} = \mu_{A_t}(B)$$.

(b) By (a), $$\mathbb E[X_t \mid A_t] = m_{A_t}$$, so $$\mathbb E[X_t] = \sum_a m_a\, \mathbb P(A_t = a)$$. Summing over $$t$$ gives $$\mathbb E[\sum_t X_t] = \sum_a m_a\, \mathbb E[N_a(n)]$$, and the rest is as in the proof of [Lemma 1.6](course-rl-2026-lecture-1.html#lemma-1-6).

(c) In general neither. With $$K = 2$$, arm 1 non-degenerate, and the policy from the [solution to Exercise 7(a)](#exercise-7) above, $$A_2$$ depends on $$X_1 = Y_{1,1}$$, so it is independent of neither $$X_1$$ nor $$Y_1$$. (A policy that ignores the rewards, such as playing the arms in turn, gives an $$A_t$$ independent of both.)

</details>

<nav class="notes-nav" aria-label="Course notes"><a href="course-rl-2026-lecture-1.html">Lecture 1 notes</a><a href="course-rl-2026-sheet-2.html">Exercise Sheet 2 →</a><a href="course-rl-2026-results.html">Results so far</a><a href="course-rl-2026.html">Course page</a></nav>
