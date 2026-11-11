---
layout: default
title: "Exercise Sheet 2"
description: "Exercise Sheet 2 for Advanced Probabilistic Methods Related to Reinforcement Learning (TU Berlin, Winter 2026/27): explore-then-commit, greedy policies, the reward table and the worst-case regret of UCB."
nav: "teaching"
body_class: "course notes"
math: true
---
# Exercise Sheet 2

[Advanced Probabilistic Methods Related to Reinforcement Learning](course-rl-2026.html) · TU Berlin · Winter 2026/27
{: .lede}

Notation as in the [Lecture 2 notes](course-rl-2026-lecture-2.html). Exercises marked <span class="tag">used later</span> are needed in later lectures. Click *Solution* under an exercise to reveal its solution.

Please report any errors or unclear points, in the lecture or by email.
{: .note}

**Exercise 2.1 (ETC: the log n bound).** Prove [Theorem 2.4(b)](course-rl-2026-lecture-2.html#theorem-2-4). For $$K = 2$$, with $$\ell = \ell_{\min}$$, what is the probability of committing to the wrong arm, and what does such a mistake cost? Minimise $$\Delta\ell + \Delta n\, e^{-\ell\Delta^2/(4\sigma^2)}$$ over real $$\ell$$ and compare.
{: #exercise-2-1}

<details class="solution" markdown="1">
<summary>Solution</summary>

Take $$\ell = \ell_{\min}$$ in [Theorem 2.4(a)](course-rl-2026-lecture-2.html#theorem-2-4). For every $$a$$ with $$\Delta_a > 0$$ we have $$\Delta_a \ge \Delta_{\min}$$, so

$$
e^{-\ell_{\min}\Delta_a^2/(4\sigma^2)} \le e^{-(\Delta_a^2/\Delta_{\min}^2)\log n} = n^{-\Delta_a^2/\Delta_{\min}^2} \le \frac1n.
$$

With $$\ell_{\min} \le (4\sigma^2/\Delta_{\min}^2)\log n + 1$$, (a) gives $$R_n \le \sum_a \Delta_a\big(\frac{4\sigma^2\log n}{\Delta_{\min}^2} + 1\big) + \sum_a \Delta_a$$, which is (b). Arms with $$\Delta_a = 0$$ contribute nothing.

For $$K = 2$$, the probability of committing to the wrong arm is at most $$e^{-\ell_{\min}\Delta^2/(4\sigma^2)} \le 1/n$$, and the mistake costs $$(n - 2\ell)\Delta \le n\Delta$$, so its expected cost is at most $$\Delta$$. Minimising $$f(\ell) = \Delta\ell + \Delta n e^{-\ell\Delta^2/(4\sigma^2)}$$: $$f'(\ell) = 0$$ gives $$e^{-\ell\Delta^2/(4\sigma^2)} = 4\sigma^2/(n\Delta^2)$$, so, when $$n\Delta^2 > 4\sigma^2$$,

$$
\ell^* = \frac{4\sigma^2}{\Delta^2}\log\frac{n\Delta^2}{4\sigma^2}, \qquad f(\ell^*) = \frac{4\sigma^2}{\Delta}\Big(\log\frac{n\Delta^2}{4\sigma^2} + 1\Big).
$$

This is the same $$\frac{4\sigma^2}{\Delta}\log n$$ to leading order as $$n \to \infty$$, but smaller when $$\Delta$$ is small. Both choices need $$\Delta$$.

</details>

**Exercise 2.2 (ETC without knowing $$\Delta$$).** <span class="tag">used later</span> <span class="used-in">in <a href="course-rl-2026-lecture-2.html#4-what-is-wrong-with-etc">Lecture 2, Section 4</a></span> A 2-armed SBM with $$\sigma$$-sub-Gaussian rewards and $$\Delta \in (0, \sigma]$$ unknown.
{: #exercise-2-2}

(a) Show that $$\ell = \lceil n^{2/3} \rceil$$ gives $$R_n \le C\sigma n^{2/3}$$ with $$C$$ independent of $$\Delta$$ and $$\sigma$$. (*Hint:* maximise $$\Delta e^{-\ell\Delta^2/(4\sigma^2)}$$ over $$\Delta$$.)

(b) For Gaussian rewards $$N(m_1, \sigma^2)$$, $$N(m_2, \sigma^2)$$ and $$n \ge 64$$, show that for every fixed $$\ell$$ the supremum over $$\Delta \in (0, \sigma]$$ of $$R_n(\mathrm{ETC}(\ell))$$ is at least $$\sigma n^{2/3}/10$$. (*Hint:* consider $$\Delta = \sigma$$ and $$\Delta = \sigma\min\{1, \sqrt{2/\ell}\}$$, and use $$\mathbb P(Z > 1) \ge 0.15$$ for a standard normal $$Z$$.)

(c) Where does (b) use that rewards are Gaussian?

<details class="solution" markdown="1">
<summary>Solution</summary>

(a) With $$K = 2$$, [Theorem 2.4(a)](course-rl-2026-lecture-2.html#theorem-2-4) gives $$R_n \le \ell\Delta + n\Delta e^{-\ell\Delta^2/(4\sigma^2)}$$. The function $$\Delta \mapsto \Delta e^{-\ell\Delta^2/(4\sigma^2)}$$ is maximised at $$\Delta = \sigma\sqrt{2/\ell}$$, with value $$\sigma\sqrt{2/\ell}\, e^{-1/2}$$. Using $$\Delta \le \sigma$$ in the first term,

$$
R_n \le \sigma\ell + \sqrt2\, e^{-1/2}\, \sigma\, \frac{n}{\sqrt\ell}.
$$

With $$\ell = \lceil n^{2/3}\rceil$$, $$n^{2/3} \le \ell \le 2n^{2/3}$$, so $$R_n \le (2 + \sqrt2\, e^{-1/2})\sigma n^{2/3} \le 3\sigma n^{2/3}$$. (If $$2\ell > n$$, which needs $$n \le 9$$, then $$R_n \le n\sigma \le 3\sigma n^{2/3}$$ anyway.)

(b) For Gaussian rewards, $$\hat m_{2,\ell} - \hat m_{1,\ell} \sim N(-\Delta, 2\sigma^2/\ell)$$, so with $$Z$$ standard normal

$$
R_n(\mathrm{ETC}(\ell)) = \ell\Delta + (n - 2\ell)\,\Delta\, \mathbb P\big(Z \ge \Delta\sqrt{\ell/2}/\sigma\big).
$$

If $$\ell \ge n^{2/3}/10$$, take $$\Delta = \sigma$$: then $$R_n \ge \sigma\ell \ge \sigma n^{2/3}/10$$. If $$\ell < n^{2/3}/10$$, take $$\Delta = \sigma\min\{1, \sqrt{2/\ell}\}$$. Then $$\Delta\sqrt{\ell/2}/\sigma \le 1$$, so the probability is at least $$\mathbb P(Z \ge 1) \ge 0.15$$; also $$\Delta \ge \sigma n^{-1/3}$$ (since $$\sqrt{2/\ell} > \sqrt{20}\, n^{-1/3}$$) and $$n - 2\ell \ge \frac45 n$$. So $$R_n \ge 0.15 \cdot \frac45 n \cdot \sigma n^{-1/3} = 0.12\, \sigma n^{2/3}$$.

(c) Only in the exact law of $$\hat m_{2,\ell} - \hat m_{1,\ell}$$, which gives a *lower* bound on the probability of a wrong commitment. Sub-Gaussian tails only bound it from above.

</details>

**Exercise 2.3 (ETC must explore, whatever the rewards).** Let $$\mu$$ have mean 0 and variance $$\sigma^2 \in (0, \infty)$$; it need not be sub-Gaussian. For $$\Delta > 0$$, take the 2-armed SBM in which arm 1 pays $$\Delta + \xi$$ and arm 2 pays $$\xi$$, with $$\xi \sim \mu$$, so that $$m_1 = \Delta$$ and $$m_2 = 0$$. Fix $$\theta > 0$$ and run $$\mathrm{ETC}(\ell)$$ with $$\ell = \lceil \theta/\Delta^2 \rceil$$.
{: #exercise-2-3}

(a) Show that $$\mathbb P(\hat A = 2) \to \mathbb P\big(Z \ge \sqrt\theta/(\sigma\sqrt2)\big)$$ as $$\Delta \to 0$$, for a standard normal $$Z$$. (*Hint:* write $$\hat m_{2,\ell} - \hat m_{1,\ell}$$ in terms of the $$D_i$$ from the proof of [Theorem 2.4](course-rl-2026-lecture-2.html#theorem-2-4), and apply the central limit theorem to $$(D_1 + \dots + D_\ell)/\sqrt\ell$$. Note that $$\sqrt\ell\, \Delta \to \sqrt\theta$$.)

(b) Deduce that there are $$c > 0$$ and $$\Delta_0 > 0$$ such that $$R_n(\mathrm{ETC}(\ell)) \ge c\, n\Delta$$ whenever $$\Delta \le \Delta_0$$ and $$n \ge 4\ell$$.

<details class="solution" markdown="1">
<summary>Solution</summary>

(a) Write $$\xi^{(b)}_i$$ for the noise of the $$i$$-th pull of arm $$b$$ and $$D_i = \xi^{(2)}_i - \xi^{(1)}_i$$. The $$D_i$$ are i.i.d. with mean $$0$$ and variance $$2\sigma^2$$, with a law that does not depend on $$\Delta$$, and $$\hat m_{2,\ell} - \hat m_{1,\ell} = \frac1\ell\sum_{i \le \ell} D_i - \Delta$$. So

$$
\mathbb P\Big(\frac{1}{\sqrt\ell}\sum_{i \le \ell} D_i > \sqrt\ell\,\Delta\Big) \le \mathbb P(\hat A = 2) \le \mathbb P\Big(\frac{1}{\sqrt\ell}\sum_{i \le \ell} D_i \ge \sqrt\ell\,\Delta\Big),
$$

since $$\hat A = 2$$ if $$\hat m_{2,\ell} > \hat m_{1,\ell}$$ and only if $$\hat m_{2,\ell} \ge \hat m_{1,\ell}$$. As $$\Delta \to 0$$, $$\ell \to \infty$$ and $$\sqrt\theta \le \sqrt\ell\,\Delta < \sqrt{\theta + \Delta^2} \to \sqrt\theta$$. By the central limit theorem the normalised sum converges in law to $$N(0, 2\sigma^2)$$, whose distribution function is continuous, so both bounds converge to $$\mathbb P(\sqrt2\,\sigma Z \ge \sqrt\theta) = \mathbb P(Z \ge \sqrt\theta/(\sigma\sqrt2))$$.

(b) Let $$p_\theta = \mathbb P(Z \ge \sqrt\theta/(\sigma\sqrt2)) > 0$$. By (a) there is $$\Delta_0$$ with $$\mathbb P(\hat A = 2) \ge p_\theta/2$$ for $$\Delta \le \Delta_0$$. On $$\{\hat A = 2\}$$, arm 2 is played $$n - 2\ell \ge n/2$$ more times, so $$R_n \ge \frac n2 \Delta \cdot \frac{p_\theta}2$$, that is, $$c = p_\theta/4$$.

</details>

**Exercise 2.4 (greedy and ε-greedy).** <span class="tag">used later</span> <span class="used-in">in <a href="course-rl-2026-lecture-2.html#2-policy-functions-and-the-reward-table">Lecture 2, Section 2</a>; <a href="course-rl-2026-lecture-2.html#4-what-is-wrong-with-etc">Lecture 2, Section 4</a></span> The *greedy* policy plays each arm once and then always plays an arm with the largest empirical mean.
{: #exercise-2-4}

(a) Take a 2-armed SBM with rewards in $$\{0, 1\}$$ and $$m_1 > m_2$$, so $$\Delta = m_1 - m_2$$. Show that if arm 1 first pays 0 and arm 2 first pays 1, then arm 1 is never played again. Deduce that $$R_n(\mathrm{greedy}) \ge (1 - m_1)\, m_2\, (n - 1)\, \Delta$$, which is linear in $$n$$. For $$m_1 = 0.6$$ and $$m_2 = 0.5$$, how likely does this make it that greedy abandons the better arm for good?

(b) Constant ε-greedy plays a uniformly random arm with probability $$\varepsilon$$ and the greedy arm otherwise. Show $$R_n \ge \frac{\varepsilon}{K}\, n \sum_a \Delta_a$$.

<details class="solution" markdown="1">
<summary>Solution</summary>

(a) Greedy plays arm 1, then arm 2. Let $$E$$ be the event that arm 1 pays $$0$$ and arm 2 pays $$1$$, so $$\mathbb P(E) = (1 - m_1)m_2$$. On $$E$$, arm 1's empirical mean is $$0$$ and stays $$0$$ while it is not played, and arm 2's empirical mean is at least $$1/N_2 > 0$$ forever, because its first reward is $$1$$. So greedy plays arm 2 in every round $$t \ge 2$$, and $$N_2(n) = n - 1$$ on $$E$$. By [Lemma 1.6](course-rl-2026-lecture-1.html#lemma-1-6), $$R_n = \Delta\, \mathbb E[N_2(n)] \ge (1 - m_1)\, m_2\, (n - 1)\Delta$$. For $$m_1 = 0.6$$ and $$m_2 = 0.5$$, $$\mathbb P(E) = 0.2$$: greedy abandons the better arm for good with probability at least 20%.

(b) In every round, $$\mathbb P(A_t = a) \ge \varepsilon/K$$ for each arm $$a$$, so $$\mathbb E[N_a(n)] \ge \varepsilon n/K$$ and, by [Lemma 1.6](course-rl-2026-lecture-1.html#lemma-1-6), $$R_n \ge \frac{\varepsilon}{K}\, n\sum_a \Delta_a$$.

</details>

**Exercise 2.5 (the reward table, by simulation).** Use the [reward table simulation](course-rl-2026-lecture-2.html#table-demo) in the Lecture 2 notes.
{: #exercise-2-5}

(a) Step through a game with ε-greedy. In each round, check that $$A_t$$ is the piece of $$[0, 1)$$ containing $$U_t$$, and that $$X_t$$ is the next card of deck $$A_t$$. Then turn on *Show the whole table*. Which cards had the policy seen when it chose $$A_t$$?

(b) Suppose a rule for choosing $$A_t$$ were allowed to look at the next unused card of each deck, and to switch to another arm when the card it was about to use is 0 and another arm's next card is 1. Why is this not a policy? Show by an example that $$\mathbb P(X_t \in \cdot \mid H_{t-1}, A_t) = \mu_{A_t}$$ fails for it.

<details class="solution" markdown="1">
<summary>Solution</summary>

(a) When it chose $$A_t$$, the policy had seen $$U_1, \dots, U_t$$ and, of each deck $$b$$, only its first $$N_b(t - 1)$$ cards: exactly the rewards $$X_1, \dots, X_{t-1}$$. It had seen no card that was still face down.

(b) The rule makes $$A_t$$ depend on cards not yet used, which are not part of $$(H_{t-1}, U_t)$$, so it is not of the form $$A_t = f_t(H_{t-1}, U_t)$$. Example: two arms with law $$\mathrm{Ber}(\frac12)$$, and in round 1 the rule plays arm 1 unless $$Y_{1,1} = 0$$ and $$Y_{2,1} = 1$$. Then $$\{A_1 = 1\} = \{(Y_{1,1}, Y_{2,1}) \ne (0, 1)\}$$ has probability $$\frac34$$, and

$$
\mathbb P(X_1 = 1 \mid A_1 = 1) = \frac{\mathbb P(Y_{1,1} = 1)}{\mathbb P(A_1 = 1)} = \frac{1/2}{3/4} = \frac23 \ne \frac12 = \mu_1(\{1\}).
$$

</details>

**Exercise 2.6 (the worst-case bound).** <span class="tag">used later</span> <span class="used-in">in <a href="course-rl-2026-lecture-2.html#theorem-2-6">Theorem 2.6</a></span> Prove $$R_n \le 8\sigma\sqrt{Kn \log n} + 3 \sum_a \Delta_a$$ for [UCB](course-rl-2026-lecture-2.html#algorithm-2-5) with $$\delta = 1/n^2$$. (*Hint:* split the arms by whether $$\Delta_a$$ is above or below a threshold, and optimise the threshold.)
{: #exercise-2-6}

<details class="solution" markdown="1">
<summary>Solution</summary>

By [Theorem 2.6](course-rl-2026-lecture-2.html#theorem-2-6), $$\mathbb E[N_a(n)] \le 3 + 16\sigma^2\log n/\Delta_a^2$$ for every arm with $$\Delta_a > 0$$. Fix $$\eta > 0$$ and split the sum in [Lemma 1.6](course-rl-2026-lecture-1.html#lemma-1-6). The arms with $$\Delta_a \le \eta$$ contribute at most $$\eta\sum_a \mathbb E[N_a(n)] = \eta n$$. An arm with $$\Delta_a > \eta$$ contributes at most $$3\Delta_a + 16\sigma^2\log n/\Delta_a < 3\Delta_a + 16\sigma^2\log n/\eta$$. So

$$
R_n \le \eta n + \frac{16\sigma^2 K\log n}{\eta} + 3\sum_a \Delta_a,
$$

and $$\eta = 4\sigma\sqrt{K\log n/n}$$ makes each of the first two terms $$4\sigma\sqrt{Kn\log n}$$. (This is [Lemma 4.7](course-rl-2026-lecture-4.html#lemma-4-7) in Lecture 4.)

</details>

<nav class="notes-nav" aria-label="Course notes"><a href="course-rl-2026-sheet-1.html">← Exercise Sheet 1</a><a href="course-rl-2026-lecture-2.html">Lecture 2 notes</a><a href="course-rl-2026-results.html">Results so far</a><a href="course-rl-2026.html">Course page</a></nav>
