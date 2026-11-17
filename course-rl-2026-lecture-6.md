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

These notes cover the sixth lecture. Averaging the short seller's bets over the stake gives a confidence bound that holds at all sample sizes at once ([Corollary 6.2](#corollary-6-2)). Inverting it gives the K<sub>inf</sub> index policy ([Algorithm 6.3](#algorithm-6-3)), which attains the Lai–Robbins bound for every environment with rewards in $$[0, 1]$$ ([Theorem 6.4](#theorem-6-4)).

Please report any errors or unclear points, in the lecture or by email.

## 1. Recap and goal

Recall from [Lecture 5](course-rl-2026-lecture-5.html) that selling short at the price $$m$$ tests whether $$m$$ is an upper bound for the mean: if it is, the short seller rarely gets rich. For $$x_1, \dots, x_s \in [0, 1]$$, $$m \in [0, 1)$$, $$\Lambda_m = 1/(1 - m)$$ and $$\lambda \in [0, \Lambda_m]$$, the wealth of a short seller with stake $$\lambda$$ is $$W_s(\lambda, m) = \prod_{i=1}^s (1 + \lambda(m - x_i))$$ ([Definition 5.1](course-rl-2026-lecture-5.html#definition-5-1)). For $$\mu \in \mathcal M_{[0,1]}$$ ([Definition 5.2](course-rl-2026-lecture-5.html#definition-5-2)),

$$
\varphi_{\mu,m}(\lambda) = \mathbb E_\mu\big[\log\big(1 + \lambda(m - X)\big)\big]
$$

and

$$
K_{\inf}(\mu, m) = \inf\big\{ \mathrm{KL}(\mu \,\Vert\, \nu) : \nu \in \mathcal M_{[0,1]},\ \mathrm{mean}(\nu) \ge m \big\},
$$

where the constraint $$\mathrm{mean}(\nu) \ge m$$ may be replaced by $$\mathrm{mean}(\nu) > m$$ without changing $$K_{\inf}$$ ([Exercise 5.1](course-rl-2026-sheet-5.html#exercise-5-1)(b)). The Kelly criterion ([Lemma 5.4](course-rl-2026-lecture-5.html#lemma-5-4)) says that $$K_{\inf}(\mu, m) = \max_{\lambda \in [0, \Lambda_m]} \varphi_{\mu,m}(\lambda)$$. Ville's inequality ([Lemma 5.5](course-rl-2026-lecture-5.html#lemma-5-5)) says that a nonnegative supermartingale $$(M_n)_{n \in \mathbb N_0}$$ with $$\mathbb E[M_0] = 1$$ satisfies $$\mathbb P(\exists\, n : M_n \ge x) \le 1/x$$ for every $$x > 0$$.

**Today's goal.** A policy that attains the Lai–Robbins bound in every environment with rewards in $$[0, 1]$$.

**The best wealth in hindsight.** For $$s \in \mathbb N_0$$, $$x_1, \dots, x_s \in [0, 1]$$ and $$m \in [0, 1)$$, set

$$
B_s(m) = \max_{\lambda \in [0, \Lambda_m]} W_s(\lambda, m) = \max_{\lambda \in [0, \Lambda_m]} \prod_{i=1}^s \big(1 + \lambda(m - x_i)\big).
$$

The maximum is attained, since $$W_s(\cdot, m)$$ is continuous on $$[0, \Lambda_m]$$, and $$B_s(m) \ge W_s(0, m) = 1$$. If the prices are i.i.d. with mean at least $$m$$, then each $$(W_s(\lambda, m))_{s \ge 0}$$ is a nonnegative supermartingale, but $$(B_s(m))_{s \ge 0}$$ need not be, because the stake is chosen after seeing the prices. Averaging over the stakes instead loses only a factor $$s + 1$$.

## 2. Mixing the bets

**Lemma 6.1 (mixture of bets).** For all $$s \in \mathbb N$$, $$x_1, \dots, x_s \in [0, 1]$$ and $$m \in [0, 1)$$,
{: #lemma-6-1}

$$
\frac{1}{\Lambda_m} \int_0^{\Lambda_m} W_s(\lambda, m)\, d\lambda \ge \frac{B_s(m)}{s + 1}.
$$

*Proof.* Let $$\lambda^* \in [0, \Lambda_m]$$ with $$W_s(\lambda^*, m) = B_s(m)$$, and for each $$i$$ let $$a_i = 1 + \lambda^*(m - x_i)$$ and $$b_i = 1 + \Lambda_m(m - x_i)$$. Since $$x_i \le 1$$ and $$\lambda^* \le \Lambda_m$$, both are nonnegative.

On $$[0, \lambda^*]$$ we write $$\lambda = \lambda^* u$$ with $$u \in [0, 1]$$. Then $$1 + \lambda^* u(m - x_i) = (1 - u) + u a_i \ge u a_i \ge 0$$, so

$$
\begin{aligned} \int_0^{\lambda^*} W_s(\lambda, m)\, d\lambda &= \lambda^* \int_0^1 \prod_{i=1}^s \big(1 + \lambda^* u(m - x_i)\big)\, du \\ &\ge \lambda^* W_s(\lambda^*, m) \int_0^1 u^s\, du = \frac{\lambda^* B_s(m)}{s + 1}. \end{aligned}
$$

On $$[\lambda^*, \Lambda_m]$$ we write $$\lambda = (1 - u)\Lambda_m + u\lambda^*$$ with $$u \in [0, 1]$$. Then $$1 + \lambda(m - x_i) = (1 - u) b_i + u a_i \ge u a_i$$, since $$b_i \ge 0$$, and in the same way

$$
\begin{aligned} \int_{\lambda^*}^{\Lambda_m} W_s(\lambda, m)\, d\lambda &= (\Lambda_m - \lambda^*) \int_0^1 \prod_{i=1}^s \big((1 - u) b_i + u a_i\big)\, du \\ &\ge \frac{(\Lambda_m - \lambda^*)\, B_s(m)}{s + 1}. \end{aligned}
$$

Add the two bounds and divide by $$\Lambda_m$$. $$\square$$

**Corollary 6.2 (anytime confidence bound).** Let $$X_1, X_2, \dots$$ be i.i.d. with law $$\mu \in \mathcal M_{[0,1]}$$, let $$m \in [0, 1)$$ with $$\mathrm{mean}(\mu) \ge m$$, and compute $$B_s(m)$$ from $$X_1, \dots, X_s$$. Then for every $$x > 0$$,
{: #corollary-6-2}

$$
\mathbb P\big(\exists\, s \in \mathbb N : B_s(m) \ge (s + 1)\, x\big) \le \frac1x.
$$

*Proof.* Let $$\mathcal F_s = \sigma(X_1, \dots, X_s)$$, compute $$W_s(\lambda, m)$$ from $$X_1, \dots, X_s$$, and set

$$
M_s = \frac{1}{\Lambda_m} \int_0^{\Lambda_m} W_s(\lambda, m)\, d\lambda,
$$

so that $$M_0 = 1$$ and $$M_s \ge 0$$. Since $$W_{s+1}(\lambda, m) = W_s(\lambda, m)\big(1 + \lambda(m - X_{s+1})\big)$$, where $$W_s(\lambda, m)$$ is $$\mathcal F_s$$-measurable and $$X_{s+1}$$ is independent of $$\mathcal F_s$$ with $$\mathbb E[X_{s+1}] = \mathrm{mean}(\mu) \ge m$$, Fubini's theorem (the integrand is nonnegative) gives

$$
\mathbb E[M_{s+1} \mid \mathcal F_s] = \frac{1}{\Lambda_m} \int_0^{\Lambda_m} W_s(\lambda, m)\big(1 + \lambda(m - \mathrm{mean}(\mu))\big)\, d\lambda \le M_s.
$$

So $$(M_s)_{s \ge 0}$$ is a nonnegative supermartingale with $$\mathbb E[M_0] = 1$$. By [Lemma 6.1](#lemma-6-1), $$B_s(m) \ge (s + 1)x$$ implies $$M_s \ge x$$, so by [Lemma 5.5](course-rl-2026-lecture-5.html#lemma-5-5),

$$
\mathbb P\big(\exists\, s : B_s(m) \ge (s + 1)\, x\big) \le \mathbb P\big(\exists\, s : M_s \ge x\big) \le \frac1x. \qquad \square
$$

The proof uses that the prices are independent with mean at least $$m$$ only in the supermartingale property. For comparison, Markov's inequality at each fixed $$s$$ and a union bound over $$s \le n$$, as for [UCB](course-rl-2026-lecture-2.html#algorithm-2-5), would give $$n/x$$ instead of $$1/x$$.

## 3. The K<sub>inf</sub> index policy

**Monotonicity and continuity.** For $$s \in \mathbb N$$ and $$x_1, \dots, x_s \in [0, 1]$$, the map $$m \mapsto B_s(m)$$ is nondecreasing and continuous on $$[0, 1)$$, and $$B_s(0) = 1$$. Indeed, writing $$\lambda = \theta\Lambda_m$$ with $$\theta \in [0, 1]$$,

$$
B_s(m) = \max_{\theta \in [0, 1]} \prod_{i=1}^s \Big(1 + \theta\, \frac{m - x_i}{1 - m}\Big).
$$

Each factor is nonnegative, jointly continuous in $$(\theta, m) \in [0, 1] \times [0, 1)$$, and nondecreasing in $$m$$, since $$\frac{d}{dm}\frac{m - x}{1 - m} = \frac{1 - x}{(1 - m)^2} \ge 0$$. A maximum over the compact set $$[0, 1]$$ of a jointly continuous function is continuous in $$m$$. At $$m = 0$$ every factor is at most $$1$$, so $$B_s(0) = 1$$.

**Algorithm 6.3 (K<sub>inf</sub> index policy).** Given a $$K$$-armed SBM with rewards in $$[0, 1]$$, fix a horizon $$n$$. We work on the reward table ([Definition 2.2](course-rl-2026-lecture-2.html#definition-2-2)): $$Y_{a,1}, Y_{a,2}, \dots$$ are the rewards associated with arm $$a$$, and $$B_{s,a}(m)$$ denotes $$B_s(m)$$ computed from $$Y_{a,1}, \dots, Y_{a,s}$$. In round $$t \in [n]$$, for each arm $$a$$ let $$s = N_a(t-1)$$ and
{: #algorithm-6-3}

$$
U_a(t-1) = \begin{cases} 1 & \text{if } s = 0, \\ \sup\big\{ m \in [0, 1) : B_{s,a}(m) \le (s + 1)\, n \big\} & \text{if } s \ge 1. \end{cases}
$$

Then play an arm with the largest $$U_a(t-1)$$, ties broken in any fixed way.

The set in the definition contains $$m = 0$$, since $$B_{s,a}(0) = 1$$, so $$U_a(t-1) \in [0, 1]$$.

**Intuition.** Like [UCB](course-rl-2026-lecture-2.html#algorithm-2-5), this is greedy with respect to an optimistic guess of each mean. $$U_a(t-1)$$ is the largest price $$m$$ at which selling arm $$a$$'s rewards short, with the best stake in hindsight, has not yet made us rich, where rich means wealth above $$(s + 1)n$$. The factor $$s + 1$$ pays for choosing the stake in hindsight ([Lemma 6.1](#lemma-6-1)), and $$n$$ sets the confidence level: by [Corollary 6.2](#corollary-6-2) with $$x = n$$, a true mean $$m_a < 1$$ is ever rejected in this way with probability at most $$1/n$$.

**Why "K<sub>inf</sub>".** Since $$W_s(\lambda, m) = \exp\big(s\, \varphi_{\hat\mu_{a,s}, m}(\lambda)\big)$$, where $$\hat\mu_{a,s}$$ puts mass $$1/s$$ on each of $$Y_{a,1}, \dots, Y_{a,s}$$, [Lemma 5.4](course-rl-2026-lecture-5.html#lemma-5-4) gives $$\log B_{s,a}(m) = s\, K_{\inf}(\hat\mu_{a,s}, m)$$. So $$U_a(t-1) = \sup\{m : s\, K_{\inf}(\hat\mu_{a,s}, m) \le \log((s + 1)n)\}$$, while the UCB index is $$\sup\{m : s(m - \hat m_{a,s})^2/(2\sigma^2) \le \log(1/\delta)\}$$. The K<sub>inf</sub> index uses the whole empirical distribution, not only the empirical mean.

## 4. Asymptotic optimality

**Theorem 6.4.** Let $$\nu = (\mu_1, \dots, \mu_K)$$ be a $$K$$-armed SBM with rewards in $$[0, 1]$$, that is, $$\mu_a \in \mathcal M_{[0,1]}$$ for every arm $$a$$, and with $$m^* < 1$$. Then [Algorithm 6.3](#algorithm-6-3) with horizon $$n$$ satisfies, for every arm $$a$$ with $$\Delta_a > 0$$,
{: #theorem-6-4}

$$
\limsup_{n \to \infty} \frac{\mathbb E_\nu[N_a(n)]}{\log n} \le \frac{1}{K_{\inf}(\mu_a, m^*)}.
$$

By [Remark 5.3](course-rl-2026-lecture-5.html#remark-5-3), $$d_a = K_{\inf}(\mu_a, m^*)$$, so by [Theorem 4.1](course-rl-2026-lecture-4.html#theorem-4-1) (Lai–Robbins) no policy that is consistent over $$\mathcal M_{[0,1]}^K$$ does better, in any such environment. Moreover $$K_{\inf}(\mu_a, m^*) \ge 2\Delta_a^2 > 0$$ ([Exercise 5.1](course-rl-2026-sheet-5.html#exercise-5-1)(e)), so the bound is finite.

*Proof.* Assume without loss of generality that arm 1 is optimal, $$m_1 = m^*$$, and fix an arm $$a$$ with $$\Delta_a > 0$$.

*The decomposition.* Suppose that arm $$a$$ is played in round $$t$$. Then $$U_a(t-1) \ge U_1(t-1)$$, so either $$U_1(t-1) \le m^*$$ or $$U_a(t-1) > m^*$$. Hence

$$
\begin{aligned} N_a(n) = \sum_{t=1}^n \mathbf 1\{A_t = a\} &\le \sum_{t=1}^n \mathbf 1\{U_1(t-1) \le m^*\} \\ &\quad + \sum_{t=1}^n \mathbf 1\{A_t = a,\ U_a(t-1) \ge m^*\}. \end{aligned}
$$

In the second sum, let $$s = N_a(t-1)$$. The round with $$s = 0$$ contributes at most $$1$$. If $$s \ge 1$$ and $$U_a(t-1) \ge m^*$$, then $$B_{s,a}(m^*) \le (s + 1)n$$: otherwise, by monotonicity and continuity, $$B_{s,a}(m) > (s + 1)n$$ for all $$m \ge m^* - \eta$$, for some $$\eta > 0$$, so $$U_a(t-1) \le m^* - \eta$$. Since $$N_a(t-1)$$ increases by one in each round in which arm $$a$$ is played, each value of $$s$$ occurs in at most one such round. Therefore

$$
N_a(n) \le \sum_{t=1}^n \mathbf 1\{U_1(t-1) \le m^*\} + 1 + \sum_{s=1}^n \mathbf 1\big\{B_{s,a}(m^*) \le (s + 1)\, n\big\}.
$$

*The first sum.* Suppose $$U_1(t-1) \le m^*$$, and let $$s = N_1(t-1)$$. Then $$s \ge 1$$, since $$U_1(t-1) = 1 > m^*$$ otherwise, and $$B_{s,1}(m^*) \ge (s + 1)n$$: otherwise, by continuity, $$B_{s,1}(m) < (s + 1)n$$ for all $$m \le m^* + \eta$$, for some $$\eta > 0$$, so $$U_1(t-1) \ge m^* + \eta$$. Let $$E$$ be the event that $$B_{s,1}(m^*) \ge (s + 1)n$$ for some $$s \in \mathbb N$$. The rewards $$Y_{1,1}, Y_{1,2}, \dots$$ are i.i.d. with law $$\mu_1$$ and mean $$m^*$$, so [Corollary 6.2](#corollary-6-2) with $$m = m^*$$ and $$x = n$$ gives $$\mathbb P(E) \le 1/n$$. The first sum is at most $$n \mathbf 1_E$$, so its expectation is at most $$1$$. The random sample size $$N_1(t-1)$$ costs nothing here, since [Corollary 6.2](#corollary-6-2) holds for all $$s$$ at once.

*The second sum.* Write $$K = K_{\inf}(\mu_a, m^*) > 0$$ and $$\varphi = \varphi_{\mu_a, m^*}$$. By [Lemma 5.4](course-rl-2026-lecture-5.html#lemma-5-4) there is $$\lambda^* \in [0, \Lambda_{m^*}]$$ with $$\varphi(\lambda^*) = K$$. Fix $$\varepsilon \in (0, \frac12)$$ and let $$\lambda = (1 - \varepsilon)\lambda^*$$. Since $$\varphi$$ is concave (as $$\log$$ is concave and $$1 + \lambda(m^* - x)$$ is affine in $$\lambda$$) and $$\varphi(0) = 0$$,

$$
\varphi(\lambda) \ge (1 - \varepsilon)\varphi(\lambda^*) + \varepsilon\varphi(0) = (1 - \varepsilon) K.
$$

Let $$Z_i = \log\big(1 + \lambda(m^* - Y_{a,i})\big)$$. Since $$\lambda \le (1 - \varepsilon)\Lambda_{m^*}$$ and $$Y_{a,i} \in [0, 1]$$, we have $$\varepsilon \le 1 + \lambda(m^* - Y_{a,i}) \le 1 + \Lambda_{m^*} m^* = \Lambda_{m^*}$$, so $$Z_i \in [\log \varepsilon, \log \Lambda_{m^*}]$$. The $$Z_i$$ are i.i.d. with mean $$\varphi(\lambda) \ge (1 - \varepsilon)K$$, and $$B_{s,a}(m^*) \ge W_s(\lambda, m^*) = \exp(Z_1 + \dots + Z_s)$$. Hence

$$
\begin{aligned} &\mathbb P\big(B_{s,a}(m^*) \le (s + 1)\, n\big) \\ &\quad \le \mathbb P\Big(\sum_{i=1}^s Z_i \le \log\big((s + 1)n\big)\Big) \\ &\quad \le \mathbb P\Big(\sum_{i=1}^s \big(Z_i - \mathbb E[Z_i]\big) \le \log\big((s + 1)n\big) - s(1 - \varepsilon)K\Big). \end{aligned}
$$

Let $$s_n = \frac{(1 + \varepsilon)\log n}{(1 - 2\varepsilon)K}$$. For $$n$$ large enough, depending on $$\varepsilon$$ and $$K$$,

$$
\log\big((s + 1)n\big) - s(1 - \varepsilon)K \le -\varepsilon K s \qquad \text{for all } s \ge s_n,
$$

that is, $$g(s) = (1 - 2\varepsilon)Ks - \log(s + 1) \ge \log n$$. Indeed, $$g$$ is nondecreasing on $$[1/((1 - 2\varepsilon)K), \infty)$$, which contains $$s_n$$ for $$n$$ large, and $$g(s_n) = (1 + \varepsilon)\log n - \log(s_n + 1) \ge \log n$$ once $$\varepsilon \log n \ge \log(s_n + 1)$$, which holds for $$n$$ large since $$s_n$$ is of order $$\log n$$. The $$Z_i - \mathbb E[Z_i]$$ are independent with mean $$0$$ and, with $$R = \log(\Lambda_{m^*}/\varepsilon)$$, are $$\frac R2$$-sub-Gaussian ([Lemma 1.9](course-rl-2026-lecture-1.html#lemma-1-9)(b)). So for $$s \ge s_n$$, [Theorem 1.10](course-rl-2026-lecture-1.html#theorem-1-10) (Chernoff bound) with deviation $$\varepsilon K$$ gives

$$
\mathbb P\big(B_{s,a}(m^*) \le (s + 1)\, n\big) \le \exp\Big(-\frac{s\, \varepsilon^2 K^2}{2(R/2)^2}\Big) = e^{-cs},
$$

where $$c = 2\varepsilon^2 K^2/R^2 > 0$$ does not depend on $$s$$ or $$n$$.

Bounding the probabilities for $$s < s_n$$ by $$1$$,

$$
\sum_{s=1}^n \mathbb P\big(B_{s,a}(m^*) \le (s + 1)\, n\big) \le \frac{(1 + \varepsilon)\log n}{(1 - 2\varepsilon)K} + \sum_{s=1}^\infty e^{-cs}.
$$

*Conclusion.* Taking expectations in the decomposition, for $$n$$ large enough,

$$
\mathbb E_\nu[N_a(n)] \le 2 + \frac{(1 + \varepsilon)\log n}{(1 - 2\varepsilon)K_{\inf}(\mu_a, m^*)} + \frac{1}{e^c - 1}.
$$

Divide by $$\log n$$, let $$n \to \infty$$, and then let $$\varepsilon \to 0$$. $$\square$$

**Where the assumptions are used.** Rewards in $$[0, 1]$$: the factors $$1 + \lambda(m - x)$$ are nonnegative ([Lemma 6.1](#lemma-6-1), [Corollary 6.2](#corollary-6-2)), and the $$Z_i$$ are bounded (the second sum). $$m^* < 1$$: $$\Lambda_{m^*}$$ is finite, and $$U_1(t-1) = 1 > m^*$$ before arm 1 is first played. Independent rewards within each arm: [Corollary 6.2](#corollary-6-2) in the first sum, and [Theorem 1.10](course-rl-2026-lecture-1.html#theorem-1-10) in the second. Stopping short of the Kelly stake, $$\lambda = (1 - \varepsilon)\lambda^*$$, keeps the $$Z_i$$ bounded below, and by concavity costs only a factor $$1 - \varepsilon$$.

**Two consequences.** For Bernoulli arms, $$K_{\inf}(\mathrm{Ber}(m_a), m^*) = \mathrm{kl}(m_a, m^*)$$ ([Exercise 5.2](course-rl-2026-sheet-5.html#exercise-5-2)(b)), so the policy is asymptotically optimal for Bernoulli arms without being told that they are Bernoulli. For the example at the start of [Lecture 5](course-rl-2026-lecture-5.html), where arm 1 always pays $$0.6$$ and arm 2 always pays $$0.5$$, it pulls arm 2 about $$\log n/\log 1.25 \approx 4.5 \log n$$ times, against the bound $$3 + 400 \log n$$ for [UCB](course-rl-2026-lecture-2.html#algorithm-2-5).

**Simulation: the K<sub>inf</sub> index policy.** Two arms with rewards in $$[0, 1]$$, played by the K<sub>inf</sub> index policy and by $$\mathrm{UCB}(1/n^2)$$ with $$\sigma = \frac12$$, on the same reward table. The upper panel shows the K<sub>inf</sub> index policy's view of each arm: the curve $$m \mapsto \log B_{s,a}(m)$$, the level $$\log((s + 1)n)$$ at which the short seller is rich, and the index $$U_a$$ where the two meet. The lower panel shows how often each policy has played arm 2; the dashed line is the asymptotic number $$\log n/K_{\inf}(\mu_2, m^*)$$ of [Theorem 6.4](#theorem-6-4).

{% include sim-kinf.html %}

## 5. Next lecture

Lecture 7 turns to Thompson sampling, which plays each arm with the probability that it is the best one, given a prior distribution over the environments.

## Check yourself

Six true-or-false questions on this lecture. Decide, then click to see the reasoning; nothing is recorded.

{% include quiz-lecture-6.html %}

## Reading

- J. Honda and A. Takemura, An asymptotically optimal bandit algorithm for bounded support models, *COLT* 2010: the first asymptotically optimal policy for rewards in $$[0, 1]$$.
- O. Cappé, A. Garivier, O.-A. Maillard, R. Munos and G. Stoltz, Kullback–Leibler upper confidence bounds for optimal sequential allocation, *Annals of Statistics* 41 (2013), 1516–1541: KL-UCB with $$K_{\inf}$$, which is [Algorithm 6.3](#algorithm-6-3) up to the threshold.
- T. M. Cover, Universal portfolios, *Mathematical Finance* 1 (1991), 1–29: averaging over investment strategies, as in [Lemma 6.1](#lemma-6-1).
- T. Lattimore and C. Szepesvári, *Bandit Algorithms*, Cambridge University Press, 2020, freely available [online](https://tor-lattimore.com/downloads/book/book.pdf): Chapter 10 (KL-UCB).

<nav class="notes-nav" aria-label="Course notes"><a href="course-rl-2026-lecture-5.html">← Lecture 5</a><a href="course-rl-2026-results.html">Results so far</a><a href="course-rl-2026.html">Course page</a></nav>
