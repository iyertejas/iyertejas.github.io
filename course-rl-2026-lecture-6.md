---
layout: default
title: "Lecture 6: Mixing bets and the K_inf index policy"
description: "Notes for Lecture 6 of Advanced Probabilistic Methods Related to Reinforcement Learning (TU Berlin, Winter 2026/27): a mixture of short-selling bets, an anytime confidence bound, and the K_inf index policy, which attains the Lai–Robbins bound for rewards in [0, 1]."
nav: "teaching"
body_class: "course notes"
math: true
sims: true
---
# Lecture 6: Mixing bets and the K<sub>inf</sub> index policy

[Advanced Probabilistic Methods Related to Reinforcement Learning](course-rl-2026.html) · TU Berlin · Winter 2026/27 · Lecture of 17 November 2026
{: .lede}

These notes cover the sixth lecture: a policy that attains the Lai–Robbins bound in every environment with rewards in $$[0, 1]$$ ([Theorem 6.4](#theorem-6-4)).

Please report any errors or unclear points, in the lecture or by email.

## 1. Recap

From [Lecture 5](course-rl-2026-lecture-5.html):

- Short selling at the price $$m$$ tests whether $$m$$ is an upper bound for the mean: if it is, short selling rarely makes us rich.
- For $$x_1, \dots, x_s \in [0, 1]$$, $$m \in [0, 1)$$ and $$\lambda \in [0, \Lambda_m]$$ with $$\Lambda_m = 1/(1 - m)$$, the wealth is $$W_s(\lambda, m) = \prod_{i=1}^s (1 + \lambda(m - x_i))$$ ([Definition 5.1](course-rl-2026-lecture-5.html#definition-5-1)).
- $$\varphi_{\mu,m}(\lambda) = \mathbb E_\mu[\log(1 + \lambda(m - X))]$$ and $$K_{\inf}(\mu, m) = \inf\{\mathrm{KL}(\mu \,\Vert\, \nu) : \nu \in \mathcal M_{[0,1]},\ \mathrm{mean}(\nu) \ge m\}$$ ([Definition 5.2](course-rl-2026-lecture-5.html#definition-5-2)); replacing $$\ge m$$ by $$> m$$ does not change $$K_{\inf}$$ ([Exercise 5.1](course-rl-2026-sheet-5.html#exercise-5-1)(b)).
- Kelly criterion: $$K_{\inf}(\mu, m) = \max_{\lambda \in [0, \Lambda_m]} \varphi_{\mu,m}(\lambda)$$ for $$\mu \in \mathcal M_{[0,1]}$$ ([Lemma 5.4](course-rl-2026-lecture-5.html#lemma-5-4)).
- Ville's inequality: a nonnegative supermartingale $$(M_n)_{n \in \mathbb N_0}$$ with $$\mathbb E[M_0] = 1$$ satisfies $$\mathbb P(\exists\, n : M_n \ge x) \le 1/x$$ ([Lemma 5.5](course-rl-2026-lecture-5.html#lemma-5-5)).

Today we use the wealth of the best stake in hindsight,

$$
B_s(m) = \max_{\lambda \in [0, \Lambda_m]} W_s(\lambda, m) = \max_{\lambda \in [0, \Lambda_m]} \prod_{i=1}^s \big(1 + \lambda(m - x_i)\big),
$$

with $$B_0(m) = 1$$. Even if the prices are i.i.d. with mean at least $$m$$, $$(B_s(m))_{s \ge 0}$$ need not be a supermartingale, since the stake is chosen after seeing the prices. So we average over the stakes instead.

## 2. Mixing the bets

**Lemma 6.1 (mixture of bets).** For all $$s \in \mathbb N$$, $$x_1, \dots, x_s \in [0, 1]$$ and $$m \in [0, 1)$$,
{: #lemma-6-1}

$$
\frac{1}{\Lambda_m} \int_0^{\Lambda_m} W_s(\lambda, m)\, d\lambda \ge \frac{B_s(m)}{s + 1}.
$$

*Proof.* Let $$\lambda^*$$ maximise $$W_s(\cdot, m)$$ on $$[0, \Lambda_m]$$. On $$[0, \lambda^*]$$ we write $$\lambda = \lambda^* u$$ with $$u \in [0, 1]$$. Each factor satisfies $$1 + \lambda^* u(m - x_i) = (1 - u) + u(1 + \lambda^*(m - x_i)) \ge u(1 + \lambda^*(m - x_i)) \ge 0$$, so

$$
\begin{aligned} \int_0^{\lambda^*} W_s(\lambda, m)\, d\lambda &= \lambda^* \int_0^1 W_s(\lambda^* u, m)\, du \\ &\ge \lambda^* W_s(\lambda^*, m) \int_0^1 u^s\, du = \frac{\lambda^* B_s(m)}{s + 1}. \end{aligned}
$$

On $$[\lambda^*, \Lambda_m]$$ we write $$\lambda = (1 - u)\Lambda_m + u\lambda^*$$ with $$u \in [0, 1]$$. Each factor equals $$(1 - u)(1 + \Lambda_m(m - x_i)) + u(1 + \lambda^*(m - x_i)) \ge u(1 + \lambda^*(m - x_i))$$, since $$1 + \Lambda_m(m - x_i) \ge 0$$ for $$x_i \le 1$$. In the same way, $$\int_{\lambda^*}^{\Lambda_m} W_s(\lambda, m)\, d\lambda \ge (\Lambda_m - \lambda^*) B_s(m)/(s + 1)$$. Add the two bounds and divide by $$\Lambda_m$$. $$\square$$

**Corollary 6.2 (anytime confidence bound).** Let $$X_1, X_2, \dots$$ be i.i.d. with law $$\mu \in \mathcal M_{[0,1]}$$, let $$m \in [0, 1)$$ with $$\mathrm{mean}(\mu) \ge m$$, and compute $$B_s(m)$$ from $$X_1, \dots, X_s$$. Then for every $$x > 0$$,
{: #corollary-6-2}

$$
\mathbb P\big(\exists\, s \in \mathbb N : B_s(m) \ge (s + 1)\, x\big) \le \frac1x.
$$

*Proof.* Let $$\mathcal F_s = \sigma(X_1, \dots, X_s)$$ and $$M_s = \Lambda_m^{-1} \int_0^{\Lambda_m} W_s(\lambda, m)\, d\lambda$$, with $$W_s$$ computed from $$X_1, \dots, X_s$$, so that $$M_0 = 1$$ and $$M_s \ge 0$$. Since $$X_{s+1}$$ is independent of $$\mathcal F_s$$ with mean at least $$m$$, Fubini's theorem (the integrand is nonnegative) gives

$$
\mathbb E[M_{s+1} \mid \mathcal F_s] = \frac{1}{\Lambda_m} \int_0^{\Lambda_m} W_s(\lambda, m)\big(1 + \lambda(m - \mathrm{mean}(\mu))\big)\, d\lambda \le M_s.
$$

So $$(M_s)$$ is a nonnegative supermartingale. By [Lemma 6.1](#lemma-6-1), $$B_s(m) \ge (s + 1)x$$ implies $$M_s \ge x$$, and [Lemma 5.5](course-rl-2026-lecture-5.html#lemma-5-5) gives the claim. $$\square$$

## 3. The K<sub>inf</sub> index policy

**Algorithm 6.3 (K<sub>inf</sub> index policy).** Given a $$K$$-armed SBM with rewards in $$[0, 1]$$, fix a horizon $$n$$. Let $$Y_{a,1}, Y_{a,2}, \dots$$ be the rewards associated with arm $$a$$ in the reward table ([Definition 2.2](course-rl-2026-lecture-2.html#definition-2-2)), and let $$B_{s,a}(m)$$ be $$B_s(m)$$ computed from $$Y_{a,1}, \dots, Y_{a,s}$$. In round $$t$$, with $$s = N_a(t-1)$$, set
{: #algorithm-6-3}

$$
U_a(t-1) = \begin{cases} 1 & \text{if } s = 0, \\ \sup\big\{ m \in [0, 1) : B_{s,a}(m) \le (s + 1)\, n \big\} & \text{if } s \ge 1, \end{cases}
$$

and play an arm with the largest $$U_a(t-1)$$, ties broken in any fixed way.

**Intuition.** Like [UCB](course-rl-2026-lecture-2.html#algorithm-2-5), this is greedy with respect to an optimistic guess of each mean: $$U_a(t-1)$$ is the largest price $$m$$ at which short selling arm $$a$$'s rewards, with the best stake in hindsight, has not made us rich, where rich means wealth above $$(s + 1)n$$. By [Corollary 6.2](#corollary-6-2) with $$x = n$$, a true mean is ever rejected in this way with probability at most $$1/n$$.

**Reading off the index.** For $$m \in [0, 1)$$,

$$
U_a(t-1) \ge m \iff B_{s,a}(m) \le (s + 1)\, n.
$$

Indeed, $$m \mapsto B_s(m)$$ is nondecreasing and continuous on $$[0, 1)$$ with $$B_s(0) = 1$$: substituting $$\lambda = \theta\Lambda_m$$, we get $$B_s(m) = \max_{\theta \in [0, 1]} \prod_{i=1}^s (1 + \theta(m - x_i)/(1 - m))$$, where each factor is nonnegative, continuous in $$(\theta, m)$$, and nondecreasing in $$m$$. So the set in the definition is an interval that contains $$0$$ and, if its supremum is below $$1$$, contains its supremum.

**Try it.** Run the K<sub>inf</sub> index policy and $$\mathrm{UCB}(1/n^2)$$ side by side, on the same rewards.

{% include sim-kinf-run.html %}

Three arms with means $$0.6$$, $$0.5$$ and $$0.4$$, and $$n = 1000$$. Each arm has a row per policy, labelled with its number of pulls. Each reward is $$m_a \pm 0.1$$ with probability $$\frac12$$ each, always $$m_a$$, or Bernoulli. For UCB, $$\sigma = \frac12$$, since rewards in $$[0, 1]$$ are $$\frac12$$-sub-Gaussian.
{: .caption}

## 4. Asymptotic optimality

**Theorem 6.4.** Let $$\nu = (\mu_1, \dots, \mu_K)$$ be a $$K$$-armed SBM with $$\mu_a \in \mathcal M_{[0,1]}$$ for every arm $$a$$, and $$m^* < 1$$. Then [Algorithm 6.3](#algorithm-6-3) with horizon $$n$$ satisfies, for every arm $$a$$ with $$\Delta_a > 0$$,
{: #theorem-6-4}

$$
\limsup_{n \to \infty} \frac{\mathbb E_\nu[N_a(n)]}{\log n} \le \frac{1}{K_{\inf}(\mu_a, m^*)}.
$$

By [Remark 5.3](course-rl-2026-lecture-5.html#remark-5-3) and [Theorem 4.1](course-rl-2026-lecture-4.html#theorem-4-1) (Lai–Robbins), no policy that is consistent over $$\mathcal M_{[0,1]}^K$$ does better, in any such environment.

*Proof.* Assume without loss of generality that arm 1 is optimal, and fix an arm $$a$$ with $$\Delta_a > 0$$. If arm $$a$$ is played in round $$t$$, then $$U_a(t-1) \ge U_1(t-1)$$, so either $$U_1(t-1) < m^*$$, or $$U_a(t-1) \ge m^*$$ and hence, if $$s = N_a(t-1) \ge 1$$, $$B_{s,a}(m^*) \le (s + 1)n$$. Since $$N_a(t-1)$$ increases by one each time arm $$a$$ is played, each value of $$s$$ occurs in at most one such round. Therefore

$$
N_a(n) \le 1 + \sum_{t=1}^n \mathbf 1\{U_1(t-1) < m^*\} + \sum_{s=1}^n \mathbf 1\big\{B_{s,a}(m^*) \le (s + 1)\, n\big\}.
$$

*The first sum.* If $$U_1(t-1) < m^*$$, then $$s = N_1(t-1) \ge 1$$, since otherwise $$U_1(t-1) = 1 > m^*$$ (here we use $$m^* < 1$$), and $$B_{s,1}(m^*) > (s + 1)n$$. The rewards $$Y_{1,1}, Y_{1,2}, \dots$$ are i.i.d. with mean $$m^*$$, so by [Corollary 6.2](#corollary-6-2) with $$x = n$$, this happens for some $$s$$ with probability at most $$1/n$$. The first sum is at most $$n$$, so its expectation is at most $$1$$.

*The second sum.* By [Lemma 5.4](course-rl-2026-lecture-5.html#lemma-5-4), some $$\lambda^* \in [0, \Lambda_{m^*}]$$ satisfies $$\varphi_{\mu_a, m^*}(\lambda^*) = K_{\inf}(\mu_a, m^*)$$, which is positive, since it is at least $$2\Delta_a^2$$ ([Exercise 5.1](course-rl-2026-sheet-5.html#exercise-5-1)(e)). Fix $$\varepsilon \in (0, \frac12)$$ and let $$\lambda = (1 - \varepsilon)\lambda^*$$. Since $$\varphi_{\mu_a, m^*}$$ is concave with $$\varphi_{\mu_a, m^*}(0) = 0$$, we have $$\varphi_{\mu_a, m^*}(\lambda) \ge (1 - \varepsilon)K_{\inf}(\mu_a, m^*)$$. As $$B_{s,a}(m^*) \ge W_s(\lambda, m^*)$$,

$$
\begin{aligned} &\mathbb P\big(B_{s,a}(m^*) \le (s + 1)\, n\big) \\ &\quad \le \mathbb P\Big(\sum_{i=1}^s \log\big(1 + \lambda(m^* - Y_{a,i})\big) \le \log\big((s + 1)n\big)\Big). \end{aligned}
$$

The terms of the sum are i.i.d. with mean $$\varphi_{\mu_a, m^*}(\lambda) \ge (1 - \varepsilon)K_{\inf}(\mu_a, m^*)$$, and lie in $$[\log \varepsilon, \log \Lambda_{m^*}]$$ since $$\lambda \le (1 - \varepsilon)\Lambda_{m^*}$$. For $$n$$ large, $$\log((s + 1)n) \le (1 - 2\varepsilon)K_{\inf}(\mu_a, m^*)\, s$$ for all $$s \ge (1 + \varepsilon)\log n/((1 - 2\varepsilon)K_{\inf}(\mu_a, m^*))$$. For these $$s$$ the sum must fall $$\varepsilon K_{\inf}(\mu_a, m^*)\, s$$ below its mean, so by [Lemma 1.9](course-rl-2026-lecture-1.html#lemma-1-9)(b) and [Theorem 1.10](course-rl-2026-lecture-1.html#theorem-1-10) the probability is at most $$e^{-cs}$$, with $$c > 0$$ independent of $$s$$ and $$n$$. Bounding the probabilities for smaller $$s$$ by $$1$$,

$$
\mathbb E_\nu[N_a(n)] \le 2 + \frac{(1 + \varepsilon)\log n}{(1 - 2\varepsilon)K_{\inf}(\mu_a, m^*)} + \sum_{s=1}^\infty e^{-cs}.
$$

Divide by $$\log n$$, let $$n \to \infty$$, and then let $$\varepsilon \to 0$$. $$\square$$

Stopping short of the Kelly stake keeps the logarithms bounded below, so that the Chernoff bound applies, and by concavity costs only a factor $$1 - \varepsilon$$.

**The betting view.** For each arm, the curve $$m \mapsto \log B_{s,a}(m)$$, the level $$\log((s + 1)n)$$ at which the short seller is rich, and the index where they meet. The lower panel compares the K<sub>inf</sub> index policy with $$\mathrm{UCB}(1/n^2)$$ on the same rewards.

{% include sim-kinf.html %}

## 5. Next lecture

Lecture 7 turns to Thompson sampling.

## Check yourself

Six true-or-false questions on this lecture. Decide, then click to see the reasoning; nothing is recorded.

{% include quiz-lecture-6.html %}

## Reading

- J. Honda and A. Takemura, An asymptotically optimal bandit algorithm for bounded support models, *COLT* 2010: the first asymptotically optimal policy for rewards in $$[0, 1]$$.
- O. Cappé, A. Garivier, O.-A. Maillard, R. Munos and G. Stoltz, Kullback–Leibler upper confidence bounds for optimal sequential allocation, *Annals of Statistics* 41 (2013), 1516–1541: KL-UCB. By [Lemma 5.4](course-rl-2026-lecture-5.html#lemma-5-4), $$\log B_s(m)$$ is $$s$$ times $$K_{\inf}$$ of the empirical distribution of the rewards and $$m$$, so [Algorithm 6.3](#algorithm-6-3) is KL-UCB with $$K_{\inf}$$, up to the threshold.
- T. M. Cover, Universal portfolios, *Mathematical Finance* 1 (1991), 1–29: averaging over investment strategies, as in [Lemma 6.1](#lemma-6-1).
- T. Lattimore and C. Szepesvári, *Bandit Algorithms*, Cambridge University Press, 2020, freely available [online](https://tor-lattimore.com/downloads/book/book.pdf): Chapter 10 (KL-UCB).

<nav class="notes-nav" aria-label="Course notes"><a href="course-rl-2026-lecture-5.html">← Lecture 5</a><a href="course-rl-2026-results.html">Results so far</a><a href="course-rl-2026.html">Course page</a></nav>
