---
layout: default
title: "Lecture 1: Stochastic bandits and concentration"
description: "Notes for Lecture 1 of Advanced Probabilistic Methods Related to Reinforcement Learning (TU Berlin, Winter 2026/27): the stochastic bandit model, regret, sub-Gaussian random variables and the Chernoff bound."
nav: "teaching"
body_class: "course notes"
math: true
sims: true
---
# Lecture 1: Stochastic bandits and concentration

[Advanced Probabilistic Methods Related to Reinforcement Learning](course-rl-2026.html) · TU Berlin · Winter 2026/27 · Lecture of 13 October 2026
{: .lede}

These notes cover the first lecture: the stochastic bandit model, regret and the regret decomposition, sub-Gaussian random variables and the Chernoff bound. The exercises are on [Exercise Sheet 1](course-rl-2026-sheet-1.html).

Please report any errors or unclear points, in the lecture or by email.
{: .note}

## 1. The stochastic bandit model

A learner repeatedly chooses between $$K$$ options, called *arms*, and receives a random reward from the arm it chooses. Think of a video platform choosing between a cat video, a dog video and a politics video, and being rewarded when you watch. Each choice earns a reward now and also gives information about the arm chosen, and information only comes from arms that are tried. Balancing the two is the *exploration–exploitation trade-off*.

**Try it.** Three slot machines pay out 1 or 0, each with its own unknown probability, and you have 50 pulls. Under each machine you see how often you have pulled it, its average payout so far, and a shaded confidence interval. When you finish (or stop early), the machines are revealed and your regret is split up as in [Lemma 1.6](#lemma-1-6) below.

{% include sim-slots.html %}

The shaded intervals are $$\hat m_a \pm \sqrt{\log(2/\delta)/(2N_a)}$$ with $$\delta = 0.1$$; see the Chernoff bound below ([Theorem 1.10](#theorem-1-10) and [Corollary 1.11](#corollary-1-11)). Each contains the true mean with probability at least 0.9 *if the number of pulls is fixed in advance*. Your pulls depend on what you have seen, so this guarantee does not directly apply; dealing with that is one of the main themes of the next lectures.
{: .caption}

**Definition 1.1 (stochastic bandit model).** Fix $$K \ge 2$$ arms and a horizon $$n \in \mathbb N$$. A *$$K$$-armed stochastic bandit model* (SBM) consists of the following.
{: #definition-1-1}

- An *environment* is $$\nu = (\mu_1, \dots, \mu_K)$$, a list of probability measures on $$\mathbb R$$ with finite means $$m_1, \dots, m_K$$. Write $$m^* = \max_a m_a$$ for the best mean and $$\Delta_a = m^* - m_a$$ for the *gap* of arm $$a$$.
- In each round $$t = 1, \dots, n$$ the learner picks an arm $$A_t \in [K] = \{1, \dots, K\}$$ and receives a real-valued reward $$X_t$$. This reward is all it observes in that round.
- The *history* after $$t$$ rounds is the random vector $$H_t = (A_1, X_1, \dots, A_t, X_t)$$, with $$H_0$$ empty. We write $$\mathcal F_t = \sigma(H_t)$$ for the $$\sigma$$-algebra it generates; conditioning on $$H_t$$ means conditioning on $$\mathcal F_t$$.
- Rewards satisfy

$$
\mathbb P\big(X_t \in \cdot \mid H_{t-1}, A_t\big) = \mu_{A_t}(\cdot).
$$

In words: given the past and the arm pulled, the reward is a fresh draw from that arm's distribution. Rewards are not assumed independent of the past in any other sense. The learner's choices depend on earlier rewards, and that is what makes the problem interesting.

**Remark 1.2 (stationarity).** In this model the distributions $$\mu_a$$ do not change over time. One can also allow the reward distribution of arm $$a$$ in round $$t$$ to be $$\mu_{a,t}$$, with a mean $$m_{a,t}$$ that changes with $$t$$: the video platform's users change their tastes. Such *non-stationary* bandits are harder, and in the first part of the course we stay with the stationary model.
{: #remark-1-2}

**Definition 1.3 (policy).** A *policy* $$\pi$$ tells the learner how to choose $$A_t$$ on the basis of the history $$H_{t-1}$$, possibly using extra randomness. (Formally, $$\pi = (\pi_t)_{t \ge 1}$$ is a sequence of probability kernels from $$([K] \times \mathbb R)^{t-1}$$ to $$[K]$$: for each possible history $$h = (a_1, x_1, \dots, a_{t-1}, x_{t-1})$$, $$\pi_t(\cdot, h)$$ is a probability measure on $$[K]$$, and for each arm $$a$$, $$h \mapsto \pi_t(a, h)$$ is measurable. The learner draws $$A_t$$ from $$\pi_t(\cdot, H_{t-1})$$; that is, $$\mathbb P(A_t = a \mid H_{t-1}) = \pi_t(a, H_{t-1})$$.)
{: #definition-1-3}

A policy is *deterministic* if each $$\pi_t(\cdot, h)$$ is a point mass, that is, $$A_t$$ is a function of $$H_{t-1}$$. The point of defining $$\pi$$ on possible histories $$h$$, rather than on the random history, is that the same policy can be run in any environment. A policy and an environment together determine the law of $$H_n = (A_1, X_1, \dots, A_n, X_n)$$: writing $$h_{t-1} = (a_1, x_1, \dots, a_{t-1}, x_{t-1})$$,

$$
\mathbb P_\pi\big(A_1 = a_1, X_1 \in dx_1, \dots, A_n = a_n, X_n \in dx_n\big) = \prod_{t=1}^n \pi_t(a_t, h_{t-1})\, \mu_{a_t}(dx_t).
$$

In words: choose an arm, draw a reward from it, choose the next arm given what has been seen, and so on. We write $$\mathbb P_\pi$$ and $$\mathbb E_\pi$$ for probabilities and expectations under this law.

**Example 1.4 (policies).** Always play arm 1; play an arm chosen uniformly at random in every round; play each arm once and from then on always play the arm with the highest average reward so far.
{: #example-1-4}

## 2. Regret and the regret decomposition

**Definition 1.5 (regret).** The *regret* of a policy $$\pi$$ after $$n$$ rounds is
{: #definition-1-5}

$$
R_n(\pi) = n\,m^* - \mathbb E_\pi\Big[\sum_{t=1}^n X_t\Big].
$$

It compares $$\pi$$ with an oracle that knows the means and always plays a best arm. Regret also depends on the environment $$\nu$$, which is fixed for the whole run: it does not change from round to round. When we compare different environments we write $$R_n(\pi, \nu)$$. Some results fix $$\nu$$ and let $$n$$ grow; others fix the horizon $$n$$ first and then ask for the worst environment, which may depend on $$n$$. In both cases the environment stays fixed during the run. The *pull counts* are

$$
N_a(t) = \sum_{s=1}^{t} \mathbf 1\{A_s = a\}, \qquad a \in [K].
$$

Always playing arm $$a$$ gives regret $$n\Delta_a$$, and playing uniformly at random gives $$\frac nK \sum_a \Delta_a$$ ([Exercise 1](course-rl-2026-sheet-1.html#exercise-1)). Both grow linearly in $$n$$. The central question of the first part of the course is how slowly regret can grow, and what stops it from growing more slowly.

**Lemma 1.6 (regret decomposition).** In any SBM, for every policy $$\pi$$,
{: #lemma-1-6}

$$
R_n(\pi) = \sum_{a=1}^K \Delta_a\, \mathbb E_\pi[N_a(n)].
$$

*Proof.* Fix a round $$t$$. Given $$H_{t-1}$$ and $$A_t$$, the reward $$X_t$$ has law $$\mu_{A_t}$$, whose mean is $$m_{A_t}$$; that is, $$\mathbb E_\pi[X_t \mid H_{t-1}, A_t] = m_{A_t}$$. This is where the assumption on the rewards in [Definition 1.1](#definition-1-1) is used; $$X_t$$ is integrable because $$\mathbb E_\pi\lvert X_t\rvert \le \max_a \int \lvert x\rvert\, \mu_a(dx) < \infty$$, as the means are finite. Writing $$m_{A_t} = \sum_a m_a \mathbf 1\{A_t = a\}$$ and using the tower property,

$$
\mathbb E_\pi[X_t] = \mathbb E_\pi\big[\mathbb E_\pi[X_t \mid H_{t-1}, A_t]\big] = \mathbb E_\pi[m_{A_t}] = \sum_{a=1}^K m_a\, \mathbb P_\pi(A_t = a).
$$

Summing over $$t$$, and using $$\sum_t \mathbb P_\pi(A_t = a) = \mathbb E_\pi\big[\sum_t \mathbf 1\{A_t = a\}\big] = \mathbb E_\pi[N_a(n)]$$,

$$
\mathbb E_\pi\Big[\sum_{t=1}^n X_t\Big] = \sum_{t=1}^n \sum_{a=1}^K m_a\, \mathbb P_\pi(A_t = a) = \sum_{a=1}^K m_a\, \mathbb E_\pi[N_a(n)].
$$

Each round pulls exactly one arm, so $$\sum_a N_a(n) = n$$, and hence $$n\,m^* = \sum_a m^*\, \mathbb E_\pi[N_a(n)]$$. Subtracting,

$$
\begin{aligned}
R_n(\pi) &= \sum_{a=1}^K m^*\, \mathbb E_\pi[N_a(n)] - \sum_{a=1}^K m_a\, \mathbb E_\pi[N_a(n)] \\
&= \sum_{a=1}^K \Delta_a\, \mathbb E_\pi[N_a(n)]. \qquad \square
\end{aligned}
$$

So controlling regret means controlling how often each suboptimal arm is pulled.

**Remark 1.7.** The proof only uses the conditional mean of $$X_t$$ given the past and the current arm. The arm $$A_t$$ may depend heavily on earlier rewards; what matters is that it is chosen before $$X_t$$ is drawn. [Exercise 7](course-rl-2026-sheet-1.html#exercise-7) gives a tempting but wrong argument for the same lemma.
{: #remark-1-7}

## 3. Sub-Gaussian random variables

To control how often a bad arm is pulled, we need to know how fast empirical means concentrate around true means. The following assumption is what makes this work.

**Recall (normal distribution).** $$X \sim N(m, \sigma^2)$$ means $$X$$ has density $$\frac{1}{\sqrt{2\pi\sigma^2}} e^{-(x-m)^2/(2\sigma^2)}$$. Its moment generating function follows by completing the square, $$\lambda y - \frac{y^2}{2\sigma^2} = \frac{\lambda^2\sigma^2}{2} - \frac{(y - \lambda\sigma^2)^2}{2\sigma^2}$$:

$$
\begin{aligned}
\mathbb E\big[e^{\lambda (X - m)}\big] &= \int_{\mathbb R} e^{\lambda y}\, \frac{e^{-y^2/(2\sigma^2)}}{\sqrt{2\pi\sigma^2}}\, dy \\
&= e^{\lambda^2\sigma^2/2} \int_{\mathbb R} \frac{e^{-(y - \lambda\sigma^2)^2/(2\sigma^2)}}{\sqrt{2\pi\sigma^2}}\, dy = e^{\lambda^2\sigma^2/2},
\end{aligned}
$$

since the last integrand is the density of $$N(\lambda\sigma^2, \sigma^2)$$. Consequently, if $$X_1, \dots, X_s$$ are independent $$N(m, \sigma^2)$$, the moment generating function of $$\sum_i (X_i - m)$$ is the product $$e^{s\lambda^2\sigma^2/2}$$, which is that of $$N(0, s\sigma^2)$$. Since a moment generating function that is finite everywhere determines the law, $$\sum_i X_i \sim N(sm, s\sigma^2)$$, and the sample mean $$\hat m_s = \frac1s \sum_i X_i \sim N(m, \sigma^2/s)$$.

The definition below asks for the same bound on the moment generating function, with $$\le$$ in place of $$=$$.

**Definition 1.8 (sub-Gaussian).** A random variable $$X$$ with mean $$m$$ is *$$\sigma$$-sub-Gaussian* if
{: #definition-1-8}

$$
\mathbb E\big[e^{\lambda (X - m)}\big] \le e^{\lambda^2 \sigma^2 / 2} \qquad \text{for all } \lambda \in \mathbb R.
$$

**Lemma 1.9 (examples).**
{: #lemma-1-9}

(a) If $$X \sim N(m, \sigma^2)$$, then $$X$$ is $$\sigma$$-sub-Gaussian, with equality in the definition.

(b) If $$X \in [a, b]$$ almost surely, then $$X$$ is $$\frac{b-a}{2}$$-sub-Gaussian (Hoeffding's lemma). In particular, rewards in $$[0, 1]$$ are $$\frac12$$-sub-Gaussian.

(c) If $$X$$ is $$\sigma$$-sub-Gaussian and $$c \in \mathbb R$$, then $$cX$$ is $$\lvert c\rvert\sigma$$-sub-Gaussian. If $$X_1, X_2$$ are independent and $$\sigma_1$$-, $$\sigma_2$$-sub-Gaussian, then $$X_1 + X_2$$ is $$\sqrt{\sigma_1^2 + \sigma_2^2}$$-sub-Gaussian.

*Proof.* Part (a) is the computation above, (b) is [Exercise 3](course-rl-2026-sheet-1.html#exercise-3) and (c) is [Exercise 2](course-rl-2026-sheet-1.html#exercise-2). $$\square$$

The definition is a bound on the moment generating function, and it is exactly what the proof below uses. For bounded rewards the constant $$\sigma$$ is known without knowing the distribution.

## 4. The Chernoff bound

**Theorem 1.10 (Chernoff bound).** Let $$X_1, \dots, X_s$$ be independent and $$\sigma$$-sub-Gaussian with mean $$m$$, and let $$\hat m_s = \frac1s \sum_i X_i$$. Then for every $$\varepsilon \ge 0$$,
{: #theorem-1-10}

$$
\mathbb P(\hat m_s - m \ge \varepsilon) \le \exp\Big(-\frac{s\varepsilon^2}{2\sigma^2}\Big) \qquad\text{and}\qquad \mathbb P(\hat m_s - m \le -\varepsilon) \le \exp\Big(-\frac{s\varepsilon^2}{2\sigma^2}\Big).
$$

Consequently, $$\mathbb P(\lvert\hat m_s - m\rvert \ge \varepsilon) \le 2\exp\big(-\frac{s\varepsilon^2}{2\sigma^2}\big)$$.

*Proof.* We prove the upper tail; the lower tail and the two-sided bound are [Exercise 4](course-rl-2026-sheet-1.html#exercise-4). Let $$S = \sum_i (X_i - m)$$, so that $$\{\hat m_s - m \ge \varepsilon\} = \{S \ge s\varepsilon\}$$. For $$\varepsilon = 0$$ the bound is trivial, so let $$\varepsilon > 0$$, and fix any $$\lambda > 0$$. Then

$$
\begin{aligned}
\mathbb P(S \ge s\varepsilon) &= \mathbb P\big(e^{\lambda S} \ge e^{\lambda s\varepsilon}\big) && \text{($x \mapsto e^{\lambda x}$ is increasing, as $\lambda > 0$)} \\
&\le e^{-\lambda s\varepsilon}\, \mathbb E\big[e^{\lambda S}\big] && \text{(Markov's inequality)} \\
&= e^{-\lambda s\varepsilon} \prod_{i=1}^s \mathbb E\big[e^{\lambda (X_i - m)}\big] && \text{(independence)} \\
&\le e^{-\lambda s\varepsilon}\, e^{s\lambda^2\sigma^2/2} && \text{(each $X_i$ is $\sigma$-sub-Gaussian with mean $m$)}.
\end{aligned}
$$

This holds for every $$\lambda > 0$$, so we may choose $$\lambda$$ to minimise the exponent $$-\lambda s\varepsilon + \frac{s\lambda^2\sigma^2}{2}$$. The minimum is at $$\lambda = \varepsilon/\sigma^2$$, which is positive, and gives $$\exp\big(-\frac{s\varepsilon^2}{2\sigma^2}\big)$$. $$\square$$

**Corollary 1.11 (confidence intervals).** Under the assumptions of [Theorem 1.10](#theorem-1-10), let $$\delta \in (0, 1)$$. Each of the following holds with probability at least $$1 - \delta$$:
{: #corollary-1-11}

$$
\hat m_s < m + \sqrt{\frac{2\sigma^2 \log(1/\delta)}{s}} \qquad\text{and}\qquad \lvert\hat m_s - m\rvert < \sqrt{\frac{2\sigma^2 \log(2/\delta)}{s}}.
$$

*Proof.* For the first, set the right-hand side of the upper tail bound equal to $$\delta$$ and solve for $$\varepsilon$$. The second is [Exercise 6(a)](course-rl-2026-sheet-1.html#exercise-6). $$\square$$

The width shrinks like $$1/\sqrt s$$ and depends on the error probability $$\delta$$ only through $$\sqrt{\log(1/\delta)}$$, so very small error probabilities are cheap. For Gaussian rewards the exponent $$\frac{s\varepsilon^2}{2\sigma^2}$$ cannot be improved ([Exercise 5](course-rl-2026-sheet-1.html#exercise-5)).

## Next lecture

Explore-then-commit: play each arm a fixed number of times, then commit to the arm with the best empirical mean. [Lemma 1.6](#lemma-1-6) and [Theorem 1.10](#theorem-1-10) are exactly what we need to analyse it.

## Reading

T. Lattimore and C. Szepesvári, *Bandit Algorithms*, Cambridge University Press, 2020, freely available [online](https://tor-lattimore.com/downloads/book/book.pdf): Chapter 4 (the model and the regret decomposition) and Chapter 5 (concentration of measure).

<nav class="notes-nav" aria-label="Course notes"><a href="course-rl-2026-sheet-1.html">Exercise Sheet 1</a><a href="course-rl-2026-lecture-2.html">Lecture 2 →</a><a href="course-rl-2026-results.html">Results so far</a><a href="course-rl-2026.html">Course page</a></nav>
