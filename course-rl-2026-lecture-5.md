---
layout: default
title: "Lecture 5: Testing by betting"
description: "Notes for Lecture 5 of Advanced Probabilistic Methods Related to Reinforcement Learning (TU Berlin, Winter 2026/27): short selling as a test of the mean, the Kelly criterion, Ville's inequality and a mixture of bets, and the K_inf index policy for rewards in [0, 1]."
nav: "teaching"
body_class: "course notes"
math: true
sims: true
---
# Lecture 5: Testing by betting

[Advanced Probabilistic Methods Related to Reinforcement Learning](course-rl-2026.html) · TU Berlin · Winter 2026/27 · Lecture of 10 November 2026
{: .lede}

These notes cover the fifth lecture. The Lai–Robbins theorem says how often a consistent policy must pull a suboptimal arm. This lecture builds a policy for rewards in $$[0, 1]$$ that attains this bound. Like [UCB](course-rl-2026-lecture-2.html#algorithm-2-5), it plays the arm with the largest upper confidence bound for the mean, but the bound comes from betting rather than from the empirical mean. [Section 2](#2-short-selling) introduces the bet: selling a stock short at the price $$m$$. [Section 3](#3-the-kelly-criterion) proves the Kelly criterion: the best growth rate of the short seller's wealth is exactly the constant of the Lai–Robbins theorem. [Section 4](#4-anytime-confidence-bounds) turns wealth into a confidence bound that holds at all sample sizes at once, with Ville's inequality and an average over stakes. [Section 5](#5-the-k_inf-index-policy) defines the resulting policy. Lecture 6 proves that it is asymptotically optimal.

Please report any errors or unclear points, in the lecture or by email.

## 1. Recap and goal

As in Lecture 4, for a $$K$$-armed SBM with environment $$\nu = (\mu_1, \dots, \mu_K)$$, $$m_a = \mathrm{mean}(\mu_a)$$ is the mean of arm $$a$$, $$m^* = \max_a m_a$$ and $$\Delta_a = m^* - m_a$$, where $$\mathrm{mean}(\mu) = \int x\, \mu(dx)$$; $$N_a(n)$$ is the number of pulls of arm $$a$$ up to the horizon $$n$$. Recall [Theorem 4.1](course-rl-2026-lecture-4.html#theorem-4-1) (Lai–Robbins): if $$\pi$$ is a policy that is consistent over an unstructured class $$\mathcal M^K$$, then for every $$\nu \in \mathcal M^K$$ and every arm $$a$$ with $$\Delta_a > 0$$,

$$
\liminf_{n \to \infty} \frac{\mathbb E_\nu[N_a(n)]}{\log n} \ge \frac{1}{d_a}, \qquad d_a = d_a(\nu, \mathcal M) = \inf\big\{ \mathrm{KL}(\mu_a \,\Vert\, \mu') : \mu' \in \mathcal M,\ \mathrm{mean}(\mu') > m^* \big\} \in [0, \infty].
$$

**Today's goal.** Work towards a policy that attains this bound, assuming only that the rewards take values in $$[0, 1]$$.

The algorithms so far find the means. [Explore-then-commit](course-rl-2026-lecture-2.html#algorithm-2-3) uses the empirical mean to estimate each mean, and [UCB](course-rl-2026-lecture-2.html#algorithm-2-5) uses the empirical mean to build an upper confidence bound for it. The following example shows that the empirical mean alone is not enough.

**Example.** Rewards are known only to lie in $$[0, 1]$$. Arm 1 pays $$0.6$$ every time and arm 2 pays $$0.5$$ every time, so $$\Delta_2 = 0.1$$. Rewards in $$[0, 1]$$ are $$\frac12$$-sub-Gaussian ([Lemma 1.9(b)](course-rl-2026-lecture-1.html#lemma-1-9)), so [Theorem 2.6](course-rl-2026-lecture-2.html#theorem-2-6) bounds the number of pulls of arm 2 by [UCB](course-rl-2026-lecture-2.html#algorithm-2-5)$$(1/n^2)$$ by $$3 + 16 \cdot \frac14 \log n/0.01 = 3 + 400 \log n$$. Its confidence width sees only the number of pulls and the range, so it cannot do much better. The lower bound is far smaller: $$d_2 = \log 1.25 \approx 0.22$$ ([Remark 5.3](#remark-5-3) and [Exercise 5.2](course-rl-2026-sheet-5.html#exercise-5-2)), so [Theorem 4.1](course-rl-2026-lecture-4.html#theorem-4-1) asks for only about $$4.5 \log n$$ pulls. A policy that attains the lower bound must use that arm 2 has never paid anything but $$0.5$$: the whole empirical distribution, not only its mean.

So we ask: is there another way to find an upper bound for the mean?

## 2. Short selling

Suppose that random variables $$X_1, X_2, \dots$$ with values in $$[0, 1]$$ are the successive prices of a stock, and that $$m \in [0, 1)$$ is a candidate upper bound for their mean. Suppose the current price is $$m$$. *Selling short* means borrowing a share and selling it now at the price $$m$$, then buying it back later at the random price $$X_i$$ to return it. This gets a return of $$m - X_i$$ per share: we gain if the price falls, and we lose more the larger $$X_i$$ is. If we sell $$\lambda \ge 0$$ shares short for every unit of current wealth, our wealth is multiplied by $$1 + \lambda(m - X_i)$$.

**Definition 5.1 (wealth of a short seller).** For $$s \in \mathbb N$$, $$x_1, \dots, x_s \in [0, 1]$$, $$m \in [0, 1)$$, $$\Lambda_m = 1/(1 - m)$$ and $$\lambda \in [0, \Lambda_m]$$, we write
{: #definition-5-1}

$$
W_s(\lambda, m) = \prod_{i=1}^s \big(1 + \lambda(m - x_i)\big),
$$

and $$W_0(\lambda, m) = 1$$.

Since $$x_i \le 1$$, each factor is at least $$1 - \lambda(1 - m) \ge 0$$, so $$\lambda \le \Lambda_m$$ guarantees $$W_s(\lambda, m) \ge 0$$. The stake $$\Lambda_m$$ is the largest for which a price of $$1$$ cannot make our wealth negative. At $$\lambda = \Lambda_m$$ we are all in, and a single price $$x_i = 1$$ wipes us out.

**Why wealth is evidence.** Suppose the prices are i.i.d. with law $$\mu$$. If $$\mathrm{mean}(\mu) \ge m$$, then $$\mathbb E_\mu[1 + \lambda(m - X)] = 1 + \lambda(m - \mathrm{mean}(\mu)) \le 1$$: the short sale does not pay on average, and $$(W_s(\lambda, m))_{s \ge 0}$$ is a nonnegative supermartingale. [Section 4](#4-anytime-confidence-bounds) shows that such a process rarely becomes large, at any time. So if we nevertheless get rich, that is evidence that the mean is below $$m$$, just as winning steadily at a casino that is supposed to be fair is evidence that the game is not what we were told. Short selling is a good strategy only if $$m$$ is *not* an upper bound for the mean. Two variations of the game fail. *Bankruptcy protection*, that is, allowing $$\lambda > \Lambda_m$$ and replacing the factor by its positive part, makes the short sale pay even when the mean is $$m$$: for $$m = \frac12$$, prices $$\mathrm{Ber}(\frac12)$$ and $$\lambda = 4$$, the expected factor is $$\frac12(3 + 0) = \frac32$$. A *long position*, $$\lambda < 0$$, pays when the prices are large, which is what the hypothesis $$\mathrm{mean}(\mu) \ge m$$ predicts.

**Why the log.** If instead $$\mathrm{mean}(\mu) < m$$, the short sale pays on average. But wealth compounds multiplicatively, so what matters is its growth rate. We may write

$$
W_s(\lambda, m) = \exp\Big( s \cdot \frac1s \sum_{i=1}^s \log\big(1 + \lambda(m - X_i)\big) \Big) \approx \exp\Big( s\, \mathbb E_\mu\big[\log\big(1 + \lambda(m - X)\big)\big] \Big)
$$

by the law of large numbers. The average factor is misleading: a bet that doubles or halves the wealth with probability $$\frac12$$ each has average factor $$\frac54$$, but $$\frac12 \log 2 - \frac12 \log 2 = 0$$, and the wealth does not grow. This is also why staking too much hurts: one price close to $$1$$ can undo many good rounds.

**Definition 5.2.** We write $$\mathcal M_{[0,1]}$$ for the set of probability measures on $$[0, 1]$$. For $$\mu \in \mathcal M_{[0,1]}$$ and $$m \in [0, 1)$$, set
{: #definition-5-2}

$$
\varphi_{\mu,m}(\lambda) = \mathbb E_\mu\big[\log\big(1 + \lambda(m - X)\big)\big] \in [-\infty, \infty), \qquad \lambda \in [0, \Lambda_m],
$$

where $$X$$ has law $$\mu$$, and

$$
K_{\inf}(\mu, m) = \inf\big\{ \mathrm{KL}(\mu \,\Vert\, \nu) : \nu \in \mathcal M_{[0,1]},\ \mathrm{mean}(\nu) \ge m \big\}.
$$

The expectation is well defined, since $$\log(1 + \lambda(m - x)) \le \log(1 + \lambda m)$$ is bounded above; it is $$-\infty$$ if, for example, $$\lambda = \Lambda_m$$ and $$\mu(\{1\}) > 0$$. Taking $$\nu = \mu$$ shows that $$K_{\inf}(\mu, m) = 0$$ when $$\mathrm{mean}(\mu) \ge m$$, and $$K_{\inf}(\mu, m)$$ is nondecreasing in $$m$$.

**Remark 5.3.** Let $$\nu = (\mu_1, \dots, \mu_K) \in \mathcal M_{[0,1]}^K$$ have largest mean $$m^* < 1$$. Then for every arm $$a$$ with $$\Delta_a > 0$$,
{: #remark-5-3}

$$
d_a(\nu, \mathcal M_{[0,1]}) = K_{\inf}(\mu_a, m^*)
$$

([Exercise 5.1](course-rl-2026-sheet-5.html#exercise-5-1)). The constraint $$\mathrm{mean}(\nu) \ge m^*$$ in $$K_{\inf}$$ is weaker than $$\mathrm{mean}(\mu') > m^*$$ in $$d_a$$, which gives one inequality; the other mixes an almost optimal $$\nu$$ with a small atom at $$1$$. So the target is a policy with $$\limsup_n \mathbb E_\nu[N_a(n)]/\log n \le 1/K_{\inf}(\mu_a, m^*)$$.

**Boundedness is what makes this possible.** For the class of all distributions on $$\mathbb R$$ with finite mean, an alternative can raise its mean by moving a tiny mass far to the right, at almost no cost in KL. Then $$d_a = 0$$, and by [Theorem 4.1](course-rl-2026-lecture-4.html#theorem-4-1) every consistent policy pulls every suboptimal arm more than $$C \log n$$ times for every $$C$$, asymptotically. In the language of the game: if prices could be arbitrarily large, no positive stake would be safe. Only the upper bound on the rewards matters here.

## 3. The Kelly criterion

**Lemma 5.4 (Kelly criterion).** Let $$\mu \in \mathcal M_{[0,1]}$$, $$m \in [0, 1)$$ and $$\Lambda_m = 1/(1 - m)$$. Then
{: #lemma-5-4}

$$
K_{\inf}(\mu, m) = \max_{\lambda \in [0, \Lambda_m]} \varphi_{\mu,m}(\lambda),
$$

and the maximum is attained. In words: $$K_{\inf}(\mu, m)$$ is the best rate of wealth increase when short selling at the price $$m$$.

*Proof.* Write $$\varphi = \varphi_{\mu,m}$$ and, for $$\lambda \in [0, \Lambda_m]$$ and $$x \in [0, 1]$$, $$g_\lambda(x) = 1 + \lambda(m - x) \ge 0$$, so that $$\varphi(\lambda) = \mathbb E_\mu[\log g_\lambda(X)]$$.

*The inequality* $$K_{\inf}(\mu, m) \ge \varphi(\lambda)$$ *for every* $$\lambda$$. Let $$\nu \in \mathcal M_{[0,1]}$$ with $$\mathrm{mean}(\nu) \ge m$$; we may assume $$\mathrm{KL}(\mu \,\Vert\, \nu) < \infty$$, so that $$\mu \ll \nu$$, and $$L = d\mu/d\nu$$ satisfies $$L > 0$$ $$\mu$$-almost surely. For every measurable $$h \ge 0$$, $$\mathbb E_\mu[h/L] = \mathbb E_\nu[h\, \mathbf 1\{L > 0\}] \le \mathbb E_\nu[h]$$. So, by Jensen's inequality,

$$
\varphi(\lambda) - \mathrm{KL}(\mu \,\Vert\, \nu) = \mathbb E_\mu\Big[\log \frac{g_\lambda(X)}{L(X)}\Big] \le \log \mathbb E_\mu\Big[\frac{g_\lambda(X)}{L(X)}\Big] \le \log \mathbb E_\nu\big[g_\lambda(X)\big] = \log\big(1 + \lambda(m - \mathrm{mean}(\nu))\big) \le 0,
$$

since $$\mathrm{mean}(\nu) \ge m$$. Taking the infimum over $$\nu$$ gives $$K_{\inf}(\mu, m) \ge \varphi(\lambda)$$.

*The inequality* $$K_{\inf}(\mu, m) \le \varphi(\lambda^*)$$ *for some* $$\lambda^*$$. If $$\mathrm{mean}(\mu) \ge m$$, then $$K_{\inf}(\mu, m) = 0 = \varphi(0)$$, so assume $$\mathrm{mean}(\mu) < m$$. Let

$$
A(\lambda) = \mathbb E_\mu\Big[\frac{1}{g_\lambda(X)}\Big] \in (0, \infty], \qquad \text{so that} \qquad 1 - A(\lambda) = \lambda\, \mathbb E_\mu\Big[\frac{m - X}{g_\lambda(X)}\Big] \tag{*}
$$

whenever $$A(\lambda) < \infty$$, since $$1 - 1/g_\lambda = \lambda(m - x)/g_\lambda$$. Suppose $$A(\lambda) \le 1$$. Then $$g_\lambda > 0$$ $$\mu$$-almost surely, and

$$
\nu_\lambda(dx) = \frac{\mu(dx)}{g_\lambda(x)} + \big(1 - A(\lambda)\big)\, \delta_1(dx)
$$

is a probability measure on $$[0, 1]$$. Since $$\nu_\lambda \ge \mu/g_\lambda$$, we have $$\mu \ll \nu_\lambda$$ with $$d\mu/d\nu_\lambda \le g_\lambda$$ $$\mu$$-almost surely, so $$\mathrm{KL}(\mu \,\Vert\, \nu_\lambda) \le \mathbb E_\mu[\log g_\lambda(X)] = \varphi(\lambda)$$. By $$(*)$$,

$$
\mathrm{mean}(\nu_\lambda) = m + \mathbb E_\mu\Big[\frac{X - m}{g_\lambda(X)}\Big] + \big(1 - A(\lambda)\big)(1 - m) = m + \big(1 - A(\lambda)\big)\Big(1 - m - \frac1\lambda\Big),
$$

which equals $$m$$ when $$A(\lambda) = 1$$ or $$\lambda = \Lambda_m$$. It remains to find $$\lambda^* \in (0, \Lambda_m]$$ with $$A(\lambda^*) \le 1$$ and one of these two properties.

For $$\lambda \le \lambda' < \Lambda_m$$ we have $$g_\lambda \ge 1 - \lambda'(1 - m) > 0$$, so $$A$$ is continuous on $$[0, \Lambda_m)$$ by dominated convergence. By $$(*)$$ and dominated convergence, $$(1 - A(\lambda))/\lambda \to m - \mathrm{mean}(\mu) > 0$$ as $$\lambda \downarrow 0$$, so $$A < 1$$ near $$0$$. As $$\lambda \uparrow \Lambda_m$$, $$1/g_\lambda(x)$$ increases for $$x \ge m$$ and stays in $$(0, 1]$$ for $$x < m$$, so by monotone and dominated convergence $$A(\lambda) \to A(\Lambda_m) \in (0, \infty]$$, with $$1/0 = \infty$$. Two cases:

- if $$A(\Lambda_m) > 1$$, then $$A(\lambda') > 1$$ for some $$\lambda' < \Lambda_m$$, and by the intermediate value theorem there is $$\lambda^* \in (0, \lambda')$$ with $$A(\lambda^*) = 1$$;
- if $$A(\Lambda_m) \le 1$$, set $$\lambda^* = \Lambda_m$$.

In both cases $$\mathrm{mean}(\nu_{\lambda^*}) = m$$, so $$K_{\inf}(\mu, m) \le \mathrm{KL}(\mu \,\Vert\, \nu_{\lambda^*}) \le \varphi(\lambda^*)$$. Together with the first part, $$K_{\inf}(\mu, m) = \varphi(\lambda^*) = \max_\lambda \varphi(\lambda)$$. $$\square$$

**Reading it.** The proof finds the best stake $$\lambda^*$$ without maximising, and with it the closest alternative $$\nu^* = \nu_{\lambda^*}$$: it reweights $$\mu$$ by $$1/g_{\lambda^*}$$, which favours large prices, and puts any missing mass at $$1$$, the one price that ruins a short seller who is all in. Moreover $$d\mu/d\nu^* = g_{\lambda^*}$$ $$\mu$$-almost surely (if $$A(\lambda^*) < 1$$, then $$\lambda^* = \Lambda_m$$ and $$\mu(\{1\}) = 0$$, since $$1/g_{\Lambda_m}(1) = \infty$$). So the wealth of the best stake is a likelihood ratio,

$$
W_s(\lambda^*, m) = \prod_{i=1}^s \frac{d\mu}{d\nu^*}(X_i),
$$

of the truth against the closest alternative, and its logarithm grows at rate $$\mathrm{KL}(\mu \,\Vert\, \nu^*) = K_{\inf}(\mu, m)$$. The first part of the proof says that no stake does better. Reading $$W_s$$ as wealth goes back to Kelly (1956), and $$\lambda^*$$ is Kelly's optimal fraction; the literature calls this approach *testing by betting*.

**Two examples with the same mean.** Take $$m = 0.6$$, so $$\Lambda_m = 2.5$$, and compare the deterministic arm of the example in [Section 1](#1-recap-and-goal), $$X \equiv 0.5$$, with a Bernoulli arm, $$X \sim \mathrm{Ber}(0.5)$$.

|  | $$X \equiv 0.5$$ | $$X \sim \mathrm{Ber}(0.5)$$ |
| --- | --- | --- |
| factor per round | $$1 + 0.1\lambda$$ | $$1 + 0.6\lambda$$ if $$X = 0$$, $$1 - 0.4\lambda$$ if $$X = 1$$ |
| $$\varphi(\lambda)$$ | $$\log(1 + 0.1\lambda)$$ | $$\frac12\log(1 + 0.6\lambda) + \frac12\log(1 - 0.4\lambda)$$ |
| best stake $$\lambda^*$$ | $$\Lambda_m = 2.5$$: all in, no risk | $$\frac{5}{12} \approx 0.42$$: cautious |
| best growth rate $$K_{\inf}$$ | $$\log 1.25 \approx 0.223$$ | $$\frac12\log 1.25 + \frac12\log\frac56 \approx 0.020$$ |
| closest alternative $$\nu^*$$ | $$0.8\,\delta_{0.5} + 0.2\,\delta_1$$ | $$\mathrm{Ber}(0.6)$$ |

For the deterministic arm, $$A(\Lambda_m) = 1/1.25 = 0.8 \le 1$$, so $$\lambda^* = \Lambda_m$$. For the Bernoulli arm, $$\varphi'(\lambda) = 0$$ gives $$0.3(1 - 0.4\lambda) = 0.2(1 + 0.6\lambda)$$, that is, $$\lambda^* = \frac{5}{12}$$, and indeed $$A(\frac{5}{12}) = \frac12 \cdot \frac{1}{1.25} + \frac12 \cdot \frac{1}{5/6} = 1$$. The two arms have the same mean, but against the noisy one we must bet cautiously, and evidence builds up about eleven times more slowly. Against the deterministic one we can go all in, because its price never reaches $$1$$. This is why $$d_a$$ depends on the whole law $$\mu_a$$, not only on its mean.

## 4. Anytime confidence bounds

To use these bets in a bandit, we must control the wealth at every sample size at once, because the number of pulls of an arm is random. In Lecture 2, a union bound over the sample sizes $$s \in [n]$$ is what forced $$\delta = 1/n^2$$ in [UCB](course-rl-2026-lecture-2.html#algorithm-2-5). For supermartingales, a bound for all sample sizes costs no more than a bound for one.

**Lemma 5.5 (Ville's inequality).** Let $$(M_n)_{n \in \mathbb N_0}$$ be a nonnegative supermartingale with $$\mathbb E[M_0] = 1$$. Then for every $$x > 0$$,
{: #lemma-5-5}

$$
\mathbb P\big(\exists\, n \in \mathbb N_0 : M_n \ge x\big) \le \frac1x.
$$

*Proof.* Let $$\tau_x = \inf\{n \in \mathbb N_0 : M_n \ge x\}$$, a stopping time, with $$\inf \emptyset = \infty$$. For each $$N \in \mathbb N$$, $$\tau_x \wedge N$$ is a bounded stopping time, and on $$\{\tau_x < N\}$$ we have $$M_{\tau_x \wedge N} = M_{\tau_x} \ge x$$. Since $$M \ge 0$$, this gives $$x\, \mathbf 1\{\tau_x < N\} \le M_{\tau_x \wedge N}$$, so by optional sampling

$$
x\, \mathbb P(\tau_x < N) \le \mathbb E\big[M_{\tau_x \wedge N}\big] \le \mathbb E[M_0] = 1.
$$

Letting $$N \to \infty$$ gives $$\mathbb P(\tau_x < \infty) \le 1/x$$. $$\square$$

For one fixed $$n$$ this is Markov's inequality; Ville's inequality, a form of Doob's maximal inequality, gives the same bound for all $$n$$ simultaneously.

**The best wealth in hindsight.** For $$s \in \mathbb N_0$$, $$x_1, \dots, x_s \in [0, 1]$$ and $$m \in [0, 1)$$, denote by

$$
B_s(m) = \max_{\lambda \in [0, \Lambda_m]} W_s(\lambda, m)
$$

the largest wealth that any fixed stake would have reached on $$x_1, \dots, x_s$$; the maximum exists since $$W_s(\cdot, m)$$ is a continuous function on a compact interval, and $$B_0(m) = 1$$. Even if the prices are i.i.d. with mean at least $$m$$, $$(B_s(m))_{s \ge 0}$$ is not a supermartingale: already $$\mathbb E[B_1(m)] > 1$$ ([Exercise 5.3](course-rl-2026-sheet-5.html#exercise-5-3)), because the stake is chosen after seeing the prices. The remedy is to average over the stakes instead of maximising.

**Lemma 5.6 (mixture of bets).** For all $$s \in \mathbb N$$, $$x_1, \dots, x_s \in [0, 1]$$ and $$m \in [0, 1)$$,
{: #lemma-5-6}

$$
\frac{1}{\Lambda_m} \int_0^{\Lambda_m} W_s(\lambda, m)\, d\lambda \ge \frac{B_s(m)}{s + 1}.
$$

*Proof.* Suppose $$\lambda^*$$ maximises $$W_s(\cdot, m)$$ on the interval $$[0, \Lambda_m]$$. On $$[0, \lambda^*]$$ we can write $$\lambda = \lambda^* u$$ with $$u \in [0, 1]$$, and each factor satisfies

$$
1 + \lambda^* u (m - x_i) = (1 - u) + u\big(1 + \lambda^*(m - x_i)\big) \ge u\big(1 + \lambda^*(m - x_i)\big),
$$

since $$1 - u \ge 0$$ and $$1 + \lambda^*(m - x_i) \ge 0$$. Hence

$$
\int_0^{\lambda^*} W_s(\lambda, m)\, d\lambda = \lambda^* \int_0^1 \prod_{i=1}^s \big(1 + \lambda^* u(m - x_i)\big)\, du \ge \lambda^* W_s(\lambda^*, m) \int_0^1 u^s\, du = \frac{\lambda^*\, W_s(\lambda^*, m)}{s + 1}.
$$

On $$[\lambda^*, \Lambda_m]$$ we can write $$\lambda = (1 - u)\Lambda_m + u\lambda^*$$ with $$u \in [0, 1]$$, and each factor equals $$(1 - u)(1 + \Lambda_m(m - x_i)) + u(1 + \lambda^*(m - x_i)) \ge u(1 + \lambda^*(m - x_i))$$, since $$1 + \Lambda_m(m - x_i) \ge 0$$. In the same way,

$$
\int_{\lambda^*}^{\Lambda_m} W_s(\lambda, m)\, d\lambda = (\Lambda_m - \lambda^*) \int_0^1 W_s\big((1 - u)\Lambda_m + u\lambda^*, m\big)\, du \ge \frac{(\Lambda_m - \lambda^*)\, W_s(\lambda^*, m)}{s + 1}.
$$

Adding the two bounds gives $$\int_0^{\Lambda_m} W_s(\lambda, m)\, d\lambda \ge \Lambda_m W_s(\lambda^*, m)/(s + 1) = \Lambda_m B_s(m)/(s + 1)$$. $$\square$$

A fixed average over the stakes loses only a factor $$s + 1$$ against the best stake in hindsight. This is Cover's universal portfolio (1991), for two assets.

**Corollary 5.7 (anytime confidence bound).** Let $$X_1, X_2, \dots$$ be i.i.d. with law $$\mu \in \mathcal M_{[0,1]}$$, let $$m \in [0, 1)$$ with $$\mathrm{mean}(\mu) \ge m$$, and compute $$B_s(m)$$ from $$X_1, \dots, X_s$$. Then for every $$x > 0$$,
{: #corollary-5-7}

$$
\mathbb P\big(\exists\, s \in \mathbb N_0 : B_s(m) \ge (s + 1)\, x\big) \le \frac1x.
$$

*Proof.* Let $$\mathcal F_s = \sigma(X_1, \dots, X_s)$$ and

$$
M_s = \frac{1}{\Lambda_m} \int_0^{\Lambda_m} W_s(\lambda, m)\, d\lambda,
$$

so that $$M_0 = 1$$ and $$M_s \ge 0$$. Since $$X_{s+1}$$ is independent of $$\mathcal F_s$$ with $$\mathbb E[X_{s+1}] = \mathrm{mean}(\mu) \ge m$$, Fubini's theorem (the integrand is nonnegative) gives

$$
\mathbb E[M_{s+1} \mid \mathcal F_s] = \frac{1}{\Lambda_m} \int_0^{\Lambda_m} W_s(\lambda, m)\big(1 + \lambda(m - \mathbb E[X_{s+1}])\big)\, d\lambda \le \frac{1}{\Lambda_m} \int_0^{\Lambda_m} W_s(\lambda, m)\, d\lambda = M_s.
$$

So $$(M_s)$$ is a nonnegative supermartingale. By [Lemma 5.6](#lemma-5-6), $$B_s(m) \ge (s + 1)x$$ implies $$M_s \ge x$$, so by [Lemma 5.5](#lemma-5-5),

$$
\mathbb P\big(\exists\, s : B_s(m) \ge (s + 1)x\big) \le \mathbb P\big(\exists\, s : M_s \ge x\big) \le \frac1x. \qquad \square
$$

This is where the prices are used to be independent with mean at least $$m$$. In logarithms: with probability at least $$1 - 1/x$$, $$\log B_s(m) < \log(s + 1) + \log x$$ for all $$s$$ at once. A union bound over $$s \le n$$ would cost $$\log n$$ instead of $$\log(s + 1)$$. For a bandit this matters: a suboptimal arm is pulled only about $$\log n$$ times, so its bound pays an extra $$\log \log n$$ rather than an extra $$\log n$$.

## 5. The K_inf index policy

For $$s \ge 1$$ and $$x_1, \dots, x_s \in [0, 1]$$, the map $$m \mapsto B_s(m)$$ on $$[0, 1)$$ is nondecreasing, since for $$m \le m'$$ we have $$[0, \Lambda_m] \subseteq [0, \Lambda_{m'}]$$ and $$1 + \lambda(m - x) \le 1 + \lambda(m' - x)$$. It is continuous, since $$W_s$$ is jointly continuous and the interval $$[0, \Lambda_m]$$ of stakes varies continuously with $$m$$. And $$B_s(0) = 1$$, since at the price $$0$$ every factor is at most $$1$$.

**Algorithm 5.8 (K_inf index policy).** Fix the horizon $$n$$. In round $$t \le n$$, for each arm $$a$$ let $$s = N_a(t - 1)$$. If $$s = 0$$, set $$U_a(t - 1) = 1$$. If $$s \ge 1$$, compute $$B^{(a)}_s(m)$$ from arm $$a$$'s first $$s$$ rewards, and set
{: #algorithm-5-8}

$$
U_a(t - 1) = \sup\big\{ m \in [0, 1) : B^{(a)}_s(m) \le (s + 1)\, n \big\}.
$$

The *K_inf index policy* plays an arm with the highest $$U_a(t - 1)$$, ties broken in favour of the smallest arm.

The set in the definition contains $$0$$, and by monotonicity it is an interval. In the language of the game: for each candidate price $$m$$, sell arm $$a$$'s rewards short at the price $$m$$ with the best stake in hindsight. $$U_a(t - 1)$$ is the highest price at which this has not yet made us rich, where rich means wealth above $$(s + 1)n$$. The factor $$s + 1$$ pays for choosing the stake in hindsight ([Lemma 5.6](#lemma-5-6)), and $$n$$ sets the confidence level, as $$\delta = 1/n^2$$ does for [UCB](course-rl-2026-lecture-2.html#algorithm-2-5).

**It is an upper confidence bound.** Suppose $$m_a < 1$$ (if $$m_a = 1$$, then $$B^{(a)}_s(m) = 1$$ for all $$m$$, and $$U_a(t - 1) = 1$$). Apply [Corollary 5.7](#corollary-5-7) with $$x = n$$ to the rewards of arm $$a$$ and $$m = m_a$$: with probability at least $$1 - 1/n$$, $$B^{(a)}_s(m_a) < (s + 1)n$$ for every $$s$$, and then $$U_a(t - 1) \ge m_a$$ in every round. So the true mean is rejected only with probability at most $$1/n$$, at any time.

**It is a KL-UCB index.** Let $$\hat\mu_{a,s} = \frac1s \sum_{i=1}^s \delta_{X_{a,i}}$$ be the empirical distribution of arm $$a$$'s first $$s$$ rewards. Then $$W_s(\lambda, m) = \exp(s\, \varphi_{\hat\mu_{a,s}, m}(\lambda))$$ exactly, so [Lemma 5.4](#lemma-5-4) gives $$B^{(a)}_s(m) = \exp(s\, K_{\inf}(\hat\mu_{a,s}, m))$$, and

$$
U_a(t - 1) = \sup\big\{ m \in [0, 1) : s\, K_{\inf}(\hat\mu_{a,s}, m) \le \log\big((s + 1)\, n\big) \big\}.
$$

Compare [UCB](course-rl-2026-lecture-2.html#algorithm-2-5), which accepts $$m$$ while $$s(m - \hat m_{a,s})^2/(2\sigma^2) \le \log(1/\delta)$$. The Gaussian exponent becomes $$K_{\inf}$$, which uses the whole empirical distribution. The index needs no model and no variance, only that the rewards lie in $$[0, 1]$$, and the horizon $$n$$.

**The example of [Section 1](#1-recap-and-goal).** For the deterministic arm paying $$0.5$$ and $$m \ge 0.5$$, the best stake is all in, and each round multiplies the wealth by $$1 + \Lambda_m(m - 0.5) = 0.5/(1 - m)$$. So $$B_s(m) = (0.5/(1 - m))^s$$, and solving $$B_s(m) \le (s + 1)n$$ gives

$$
U_2(t - 1) = 1 - 0.5\, \big((s + 1)\, n\big)^{-1/s}.
$$

For small $$s$$ this is close to $$1$$: the arm could still be the best. As $$s$$ grows, it falls towards $$0.5$$, and it drops below $$m^* = 0.6$$ once $$s \log 1.25 > \log((s + 1)n)$$, after about $$\log n/\log 1.25 \approx 4.5 \log n$$ pulls, the number that [Theorem 4.1](course-rl-2026-lecture-4.html#theorem-4-1) asks for.

## 6. Next lecture

Lecture 6 proves that the K_inf index policy is asymptotically optimal: for every SBM with rewards in $$[0, 1]$$ and $$m^* < 1$$, and every arm $$a$$ with $$\Delta_a > 0$$,

$$
\limsup_{n \to \infty} \frac{\mathbb E_\nu[N_a(n)]}{\log n} \le \frac{1}{K_{\inf}(\mu_a, m^*)},
$$

which matches [Theorem 4.1](course-rl-2026-lecture-4.html#theorem-4-1) by [Remark 5.3](#remark-5-3). It then turns to a second, randomised way to explore: Thompson sampling.

## Check yourself

Six true-or-false questions on this lecture. Decide, then click to see the reasoning; nothing is recorded.

{% include quiz-lecture-5.html %}

## Reading

J. Honda and A. Takemura, An asymptotically optimal bandit algorithm for bounded support models, *COLT* 2010: $$K_{\inf}$$, the formula of [Lemma 5.4](#lemma-5-4), and the first asymptotically optimal policy for rewards in $$[0, 1]$$. O. Cappé, A. Garivier, O.-A. Maillard, R. Munos and G. Stoltz, Kullback–Leibler upper confidence bounds for optimal sequential allocation, *Annals of Statistics* 41 (2013), 1516–1541: KL-UCB with $$K_{\inf}$$. T. Lattimore and C. Szepesvári, *Bandit Algorithms*, Cambridge University Press, 2020, freely available [online](https://tor-lattimore.com/downloads/book/book.pdf): Chapter 10 (KL-UCB) and Chapter 16 (asymptotic lower bounds).

On betting: J. L. Kelly, A new interpretation of information rate, *Bell System Technical Journal* 35 (1956), 917–926. J. Ville, *Étude critique de la notion de collectif*, Gauthier-Villars, 1939, for [Lemma 5.5](#lemma-5-5). T. M. Cover, Universal portfolios, *Mathematical Finance* 1 (1991), 1–29, for [Lemma 5.6](#lemma-5-6). I. Waudby-Smith and A. Ramdas, Estimating means of bounded random variables by betting, *Journal of the Royal Statistical Society B* 86 (2024), 1–27, for confidence bounds by betting.

<nav class="notes-nav" aria-label="Course notes"><a href="course-rl-2026-lecture-4.html">← Lecture 4</a><a href="course-rl-2026-sheet-5.html">Exercise Sheet 5</a><a href="course-rl-2026-results.html">Results so far</a><a href="course-rl-2026.html">Course page</a></nav>
