---
layout: default
title: "Exercise Sheet 6"
description: "Exercise Sheet 6 for Advanced Probabilistic Methods Related to Reinforcement Learning (TU Berlin, Winter 2026/27): an interactive worked exercise on rewards bounded on one side only. Rewards bounded above are as easy as rewards in [0, 1], rewards bounded only below rule out logarithmic regret, and a second-moment bound restores it."
nav: "teaching"
body_class: "course notes"
math: true
sims: true
---
# Exercise Sheet 6

[Advanced Probabilistic Methods Related to Reinforcement Learning](course-rl-2026.html) · TU Berlin · Winter 2026/27
{: .lede}

Notation as in the [Lecture 6 notes](course-rl-2026-lecture-6.html). This sheet is a single exercise, worked through in steps. It is a bit more challenging than the exercises on earlier sheets. Try each part, then click *Hint* or *Solution* to compare.

**Exercise 6.1 (which tails can a bandit handle?).** Lecture 6 assumed rewards in $$[0, 1]$$. In practice rewards are often bounded on one side only. A waiting time, counted as the reward $$-(\text{waiting time})$$, is at most $$0$$ but can be arbitrarily negative. A return on an investment is at least $$0$$ but can be arbitrarily large.
{: #exercise-6-1}

**Predict.**

<div class="quiz">
<div class="q" data-answer="above">
<p class="q-text">Consider all reward distributions with finite mean that are bounded on one side. For which side is there a policy with \(\mathbb E_\nu[N_a(n)] = O(\log n)\) for every environment \(\nu\) and every suboptimal arm \(a\)?</p>
<div class="q-opts"><button type="button" data-v="above">Rewards at most 1</button><button type="button" data-v="below">Rewards at least 0</button></div>
<div class="q-why" hidden><p>Rewards at most 1: the K<sub>inf</sub> index policy of Lecture 6 still works (Part I). For rewards at least 0, such a policy would be consistent, but every consistent policy pulls every suboptimal arm more than any multiple of \(\log n\) times (Part II): a rare jackpot can always hide a larger mean. A bound on the second moment limits how much a jackpot can hide (Part III).</p></div>
</div>
</div>

### How many pulls until you can be sure?

A bandit policy can stop pulling an arm only once it is sure that the arm's mean is below the best mean, here $$1.25$$. A short seller who sells the rewards at the price $$1.25$$ and reaches wealth $$100$$ can be sure, with error probability at most $$1/100$$ by Ville's inequality, but only if the bet is safe under every law that the arm might have, and fair or worse under every such law with mean at least $$1.25$$. The arm pays $$0$$, $$1$$ or $$2$$ with equal probability, so its mean is $$1$$, but the short seller does not know that it never pays more. The solid curve assumes only that the rewards are at most $$M$$. The dashed line assumes only $$\mathbb E[X^2] \le B$$ (Part III), and sells $$\min\{X, T\}$$ short at the price $$1.25 - B/T$$: since $$x - \min\{x, T\} \le x^2/T$$ for $$x \ge 0$$, capping lowers any mean by at most $$B/T$$, so this bet is fair or worse whenever the mean is at least $$1.25$$, and it is safe because $$\min\{X, T\} \le T$$.

{% include sim-sure.html %}

### The betting bound

One principle decides all of this: a bet that is fair or worse under $$\nu$$ grows under $$\mu$$ at rate at most $$\mathrm{KL}(\mu \,\Vert\, \nu)$$. So to show that every $$\nu$$ with a larger mean is far from $$\mu$$, it is enough to find one *safe* bet, one that can never lose everything, that grows under $$\mu$$ and is fair or worse under every such $$\nu$$.

(a) Let $$\mu$$ and $$\nu$$ be probability measures on $$\mathbb R$$, and let $$G : \mathbb R \to [0, \infty)$$ be measurable with $$\mathbb E_\mu[G(X)] < \infty$$ and $$\mathbb E_\nu[G(X)] \le 1$$. Show that $$\mathbb E_\mu[\log G(X)] \le \mathrm{KL}(\mu \,\Vert\, \nu)$$.

<details class="solution" markdown="1">
<summary>Hint</summary>

This is the first inequality in the proof of [Lemma 5.4](course-rl-2026-lecture-5.html#lemma-5-4).

</details>

<details class="solution" markdown="1">
<summary>Solution</summary>

Since $$\log G(X) \le G(X)$$, the expectation $$\mathbb E_\mu[\log G(X)] \in [-\infty, \infty)$$ is well defined. If $$\mathrm{KL}(\mu \,\Vert\, \nu) = \infty$$ there is nothing to prove, so assume it is finite. Then $$\mu \ll \nu$$ and $$\frac{d\mu}{d\nu}(X) > 0$$ $$\mu$$-almost surely, and by Jensen's inequality, as in the proof of [Lemma 5.4](course-rl-2026-lecture-5.html#lemma-5-4),

$$
\begin{aligned} &\mathbb E_\mu[\log G(X)] - \mathrm{KL}(\mu \,\Vert\, \nu) \\ &\quad = \mathbb E_\mu\Big[\log \frac{G(X)}{\frac{d\mu}{d\nu}(X)}\Big] \le \log \mathbb E_\mu\Big[\frac{G(X)}{\frac{d\mu}{d\nu}(X)}\Big] \\ &\quad = \log \mathbb E_\nu\Big[G(X)\, \mathbf 1\Big\{\frac{d\mu}{d\nu}(X) > 0\Big\}\Big] \le \log \mathbb E_\nu[G(X)] \le 0. \end{aligned}
$$

</details>

### Part I: rewards bounded above

Let $$\mathcal M_{(-\infty, 1]}$$ be the set of probability measures on $$(-\infty, 1]$$ with finite mean. For $$\mu \in \mathcal M_{(-\infty, 1]}$$, $$m < 1$$ and $$\lambda \in [0, \Lambda_m]$$, with $$\Lambda_m = 1/(1 - m)$$ as before, let $$\varphi_{\mu,m}(\lambda) = \mathbb E_\mu[\log(1 + \lambda(m - X))]$$. It is well defined in $$[-\infty, \infty)$$, since $$\log(1 + u) \le u$$ and $$X$$ is integrable.

(b) *A larger mean cannot hide.* Let $$\mu \in \mathcal M_{(-\infty, 1]}$$ and $$\mathrm{mean}(\mu) < m < 1$$. Use (a) to show that for every $$\lambda \in [0, \Lambda_m]$$,

$$
\inf\big\{\mathrm{KL}(\mu \,\Vert\, \nu) : \nu \in \mathcal M_{(-\infty, 1]},\ \mathrm{mean}(\nu) \ge m\big\} \ge \varphi_{\mu,m}(\lambda),
$$

and that $$\varphi_{\mu,m}(\lambda) > 0$$ for all small enough $$\lambda > 0$$.

<details class="solution" markdown="1">
<summary>Hint</summary>

Apply (a) to the short sale $$G(x) = 1 + \lambda(m - x)$$. For positivity, show that $$\varphi_{\mu,m}(\lambda)/\lambda \to m - \mathrm{mean}(\mu)$$ as $$\lambda \to 0$$.

</details>

<details class="solution" markdown="1">
<summary>Solution</summary>

*The bound.* Since $$x \le 1$$ and $$\lambda \le \Lambda_m$$, the short sale $$G(x) = 1 + \lambda(m - x)$$ is nonnegative on $$(-\infty, 1]$$: it is safe. Moreover $$\mathbb E_\mu[G(X)] < \infty$$, and for every $$\nu \in \mathcal M_{(-\infty, 1]}$$ with $$\mathrm{mean}(\nu) \ge m$$, $$\mathbb E_\nu[G(X)] = 1 + \lambda(m - \mathrm{mean}(\nu)) \le 1$$. By (a), $$\varphi_{\mu,m}(\lambda) = \mathbb E_\mu[\log G(X)] \le \mathrm{KL}(\mu \,\Vert\, \nu)$$.

*Positivity.* Since $$\lambda \mapsto \log(1 + \lambda(m - x))$$ is concave and vanishes at $$\lambda = 0$$, the quotient $$\log(1 + \lambda(m - x))/\lambda$$ increases to $$m - x$$ as $$\lambda$$ decreases to $$0$$. At $$\lambda = \Lambda_m/2$$ it is at least $$-2\log 2/\Lambda_m$$ for all $$x \le 1$$, since then $$1 + \lambda(m - x) \ge \frac12$$. By monotone convergence, $$\varphi_{\mu,m}(\lambda)/\lambda \to m - \mathrm{mean}(\mu) > 0$$ as $$\lambda \to 0$$.

</details>

So every $$\nu \in \mathcal M_{(-\infty, 1]}$$ with mean at least $$m$$ is far from $$\mu$$: with rewards bounded above, the short sale is safe, and there is nowhere for a larger mean to hide.

(c) *Lecture 6 carries over.* Let $$\nu = (\mu_1, \dots, \mu_K)$$ with $$\mu_a \in \mathcal M_{(-\infty, 1]}$$ for every arm $$a$$, and $$m^* < 1$$. Show that [Algorithm 6.3](course-rl-2026-lecture-6.html#algorithm-6-3), with $$m$$ ranging over $$(-\infty, 1)$$, is well defined for these rewards, and that for every arm $$a$$ with $$\Delta_a > 0$$ and every $$\lambda \in [0, \Lambda_{m^*})$$ with $$\varphi_{\mu_a, m^*}(\lambda) > 0$$,

$$
\limsup_{n \to \infty} \frac{\mathbb E_\nu[N_a(n)]}{\log n} \le \frac{1}{\varphi_{\mu_a, m^*}(\lambda)}.
$$

<details class="solution" markdown="1">
<summary>Hint</summary>

Go through [Lemma 6.1](course-rl-2026-lecture-6.html#lemma-6-1), [Corollary 6.2](course-rl-2026-lecture-6.html#corollary-6-2), "Reading off the index" and the proof of [Theorem 6.4](course-rl-2026-lecture-6.html#theorem-6-4), and find where they use that the rewards lie in $$[0, 1]$$. Only two places need a change.

</details>

<details class="solution" markdown="1">
<summary>Solution</summary>

[Lemma 6.1](course-rl-2026-lecture-6.html#lemma-6-1), [Corollary 6.2](course-rl-2026-lecture-6.html#corollary-6-2) and "Reading off the index" use the bounds on the rewards only through two facts, which need only $$x_i \le 1$$ and $$m < 1$$: the factors $$1 + \lambda(m - x_i)$$ are nonnegative for $$\lambda \in [0, \Lambda_m]$$ (at $$\lambda = \Lambda_m$$ the factor is $$(1 - x_i)/(1 - m)$$), and the factors $$1 + \theta(m - x_i)/(1 - m)$$ are nondecreasing in $$m$$ (their derivative is $$\theta(1 - x_i)/(1 - m)^2$$). [Corollary 6.2](course-rl-2026-lecture-6.html#corollary-6-2) also needs the prices to have finite mean. The decomposition of $$N_a(n)$$ and the first sum in the proof of [Theorem 6.4](course-rl-2026-lecture-6.html#theorem-6-4) use only these results and $$m^* < 1$$. Two places use more.

*The index is well defined.* The fact $$B_s(0) = 1$$ used $$x_i \ge 0$$. Instead, if $$m \le \min_i x_i$$, every factor $$1 + \lambda(m - x_i)$$ is at most $$1$$, so $$B_s(m) = 1 \le (s + 1)n$$, and the set in the definition of $$U_a(t-1)$$ is nonempty.

*The second sum.* The terms $$\log(1 + \lambda(m^* - Y_{a,i}))$$ are i.i.d. with mean $$\varphi_{\mu_a, m^*}(\lambda)$$, and at least $$\log(1 - \lambda(1 - m^*)) > -\infty$$, but they are no longer bounded above, so we cap them. Fix $$\eta \in (0, \varphi_{\mu_a, m^*}(\lambda)/3)$$. By monotone convergence there is a constant $$T$$ with $$\mathbb E[\min\{\log(1 + \lambda(m^* - Y_{a,1})), T\}] \ge \varphi_{\mu_a, m^*}(\lambda) - \eta$$. Since $$B_{s,a}(m^*) \ge W_s(\lambda, m^*)$$, and capping only makes the terms smaller,

$$
\begin{aligned} &\mathbb P\big(B_{s,a}(m^*) \le (s + 1)\, n\big) \\ &\quad \le \mathbb P\Big(\sum_{i=1}^s \min\{\log(1 + \lambda(m^* - Y_{a,i})), T\} \le \log\big((s + 1)n\big)\Big). \end{aligned}
$$

For $$n$$ large, $$\log((s + 1)n) \le (\varphi_{\mu_a, m^*}(\lambda) - 2\eta)s$$ for all $$s \ge \log n/(\varphi_{\mu_a, m^*}(\lambda) - 3\eta)$$. For these $$s$$ the sum of the capped terms, which are bounded, must fall at least $$\eta s$$ below its mean, so by [Lemma 1.9](course-rl-2026-lecture-1.html#lemma-1-9)(b) and [Theorem 1.10](course-rl-2026-lecture-1.html#theorem-1-10) the probability is at most $$e^{-cs}$$, with $$c > 0$$ independent of $$s$$ and $$n$$. As in Lecture 6, $$\mathbb E_\nu[N_a(n)] \le 2 + \log n/(\varphi_{\mu_a, m^*}(\lambda) - 3\eta) + \sum_{s \ge 1} e^{-cs}$$. Divide by $$\log n$$, let $$n \to \infty$$, and then let $$\eta \to 0$$.

</details>

By (b), such $$\lambda$$ exist, so the regret is logarithmic. Taking the supremum over $$\lambda$$, the bound becomes $$1/\sup_\lambda \varphi_{\mu_a, m^*}(\lambda)$$. Honda and Takemura (2015) show that this supremum equals the infimum in (b), as in [Lemma 5.4](course-rl-2026-lecture-5.html#lemma-5-4), so the policy is asymptotically optimal for rewards bounded above. In particular, minimising waiting times needs no bound on how long a wait can be.

### Part II: rewards bounded below

Let $$\mathcal M_{[0, \infty)}$$ be the set of probability measures on $$[0, \infty)$$ with finite mean.

(d) *A jackpot hides a larger mean.* Let $$\mu \in \mathcal M_{[0, \infty)}$$ and $$m > \mathrm{mean}(\mu)$$. Show that

$$
\inf\big\{\mathrm{KL}(\mu \,\Vert\, \nu) : \nu \in \mathcal M_{[0, \infty)},\ \mathrm{mean}(\nu) > m\big\} = 0.
$$

Deduce that every policy that is consistent over $$\mathcal M_{[0, \infty)}^K$$ satisfies $$\mathbb E_\nu[N_a(n)]/\log n \to \infty$$ for every $$\nu \in \mathcal M_{[0, \infty)}^K$$ and every arm $$a$$ with $$\Delta_a > 0$$.

<details class="solution" markdown="1">
<summary>Hint</summary>

Mix $$\mu$$ with a jackpot: a point mass far out, with small probability.

</details>

<details class="solution" markdown="1">
<summary>Solution</summary>

Let $$\theta \in (0, 1)$$, let $$M > m/\theta$$, and let $$\nu = (1 - \theta)\mu + \theta\delta_M$$, where $$\delta_M$$ is the point mass at $$M$$: a jackpot. Then $$\nu \in \mathcal M_{[0, \infty)}$$, and $$\mathrm{mean}(\nu) = (1 - \theta)\,\mathrm{mean}(\mu) + \theta M > m$$. Since $$\nu \ge (1 - \theta)\mu$$, we have $$\mu \ll \nu$$ with $$d\mu/d\nu \le 1/(1 - \theta)$$, so

$$
\mathrm{KL}(\mu \,\Vert\, \nu) = \mathbb E_\mu\Big[\log\frac{d\mu}{d\nu}(X)\Big] \le \log\frac{1}{1 - \theta}.
$$

Letting $$\theta \to 0$$ gives the claim. Applied with $$\mu = \mu_a$$ and $$m = m^*$$, it shows that $$d_a = 0$$ in [Theorem 4.1](course-rl-2026-lecture-4.html#theorem-4-1), and with the convention $$1/0 = \infty$$ that theorem gives $$\liminf_n \mathbb E_\nu[N_a(n)]/\log n = \infty$$. So the regret of every consistent policy grows faster than any multiple of $$\log n$$.

</details>

(e) *Why.* Let $$\mu$$, $$\theta$$ and $$\nu$$ be as in the solution of (d). Show that for every event $$A$$ determined by $$s$$ i.i.d. rewards, $$\mathbb P_\nu(A) \ge (1 - \theta)^s\, \mathbb P_\mu(A)$$, where the subscript gives the law of each reward. Deduce that any rule which, after $$s$$ rewards, declares "the mean is at most $$m$$" with probability at least $$1 - \alpha$$ when the law is $$\mu$$, makes this false declaration with probability at least $$(1 - \theta)^s(1 - \alpha)$$ when the law is $$\nu$$. Then explain, using (a), why no safe bet can rule out $$\nu$$.

<details class="solution" markdown="1">
<summary>Hint</summary>

Draw each reward from $$\nu$$ in two stages: first decide whether it is the jackpot.

</details>

<details class="solution" markdown="1">
<summary>Solution</summary>

Draw each reward from $$\nu$$ in two stages: toss a coin that shows heads with probability $$\theta$$; on heads the reward is $$M$$, and on tails it is drawn from $$\mu$$. With probability $$(1 - \theta)^s$$ all $$s$$ coins show tails, and on this event, which is independent of the draws from $$\mu$$, the $$s$$ rewards are i.i.d. with law $$\mu$$. Hence $$\mathbb P_\nu(A) \ge (1 - \theta)^s \mathbb P_\mu(A)$$ for every such event. Take $$A$$ to be the event that the rule declares "the mean is at most $$m$$". Then $$\mathbb P_\nu(A) \ge (1 - \theta)^s(1 - \alpha)$$, although $$\mathrm{mean}(\nu) > m$$. For $$\theta$$ much smaller than $$1/s$$ this is close to $$1 - \alpha$$: with high probability, $$\nu$$ never pays the jackpot in $$s$$ draws. So no amount of data certifies that a mean is below a given level, and that is what a bandit policy needs before it stops pulling a suboptimal arm.

In the language of (a): the natural bet against $$\nu$$ is the short sale $$1 + \lambda(m - X)$$, but for every stake $$\lambda > 0$$ a reward above $$m + 1/\lambda$$ makes it negative, so it is not safe. Buying, $$1 + \lambda(X - m)$$ with $$\lambda \le 1/m$$, is safe for rewards at least $$0$$, but it grows only when the mean is above $$m$$: it certifies that a mean is high, never that it is low. In general, by (a) and (d), every safe bet that is fair or worse under all $$\nu \in \mathcal M_{[0, \infty)}$$ with mean above $$m$$ grows under $$\mu$$ at rate at most $$0$$.

</details>

This is the idea behind a classical result of Bahadur and Savage (1956) on the impossibility of confidence intervals for the mean over all distributions with finite mean.

### Part III: a bound on the second moment

In Part II, the larger mean hides in a little mass very far out. A known bound on the second moment forbids this. Let $$B > 0$$, and let $$\mathcal M_B$$ be the set of probability measures $$\nu$$ on $$[0, \infty)$$ with $$\mathbb E_\nu[X^2] \le B$$. Let $$\mu \in \mathcal M_B$$ and $$m > \mathrm{mean}(\mu)$$, and write $$\Delta = m - \mathrm{mean}(\mu)$$.

(f) *A jackpot on a budget.* Let $$\theta \in (0, 1)$$ and $$M \ge 0$$ with $$\mu(\{M\}) = 0$$, let $$\nu = (1 - \theta)\mu + \theta\delta_M$$, and suppose that $$\nu \in \mathcal M_B$$ and $$\mathrm{mean}(\nu) \ge m$$. Show that $$\theta \ge \Delta^2/B$$ and $$M \le B/\Delta$$, and that $$\mathrm{KL}(\mu \,\Vert\, \nu) \ge \Delta^2/B$$.

<details class="solution" markdown="1">
<summary>Hint</summary>

Use $$\mathrm{mean}(\nu) \ge m$$ to bound $$\theta M$$ from below, and $$\mathbb E_\nu[X^2] \le B$$ to bound $$\theta M^2$$ from above.

</details>

<details class="solution" markdown="1">
<summary>Solution</summary>

From $$\mathrm{mean}(\nu) = (1 - \theta)\,\mathrm{mean}(\mu) + \theta M \ge m$$ and $$\mathrm{mean}(\mu) \ge 0$$ we get $$\theta M \ge m - (1 - \theta)\,\mathrm{mean}(\mu) \ge \Delta$$. From $$\nu \in \mathcal M_B$$, $$\theta M^2 \le \mathbb E_\nu[X^2] \le B$$. Hence $$\theta = (\theta M)^2/(\theta M^2) \ge \Delta^2/B$$ and $$M = \theta M^2/(\theta M) \le B/\Delta$$: the jackpot can be neither far out nor rare. Since $$\mu(\{M\}) = 0$$, we have $$d\mu/d\nu = 1/(1 - \theta)$$ $$\mu$$-almost surely, so $$\mathrm{KL}(\mu \,\Vert\, \nu) = \log\frac{1}{1 - \theta} \ge \theta \ge \Delta^2/B$$.

</details>

A positive lower bound on $$\mathrm{KL}(\mu \,\Vert\, \nu)$$, of order $$\Delta^4/B^2$$, holds for every $$\nu \in \mathcal M_B$$ with mean at least $$m$$, not only for jackpots, so $$d_a > 0$$ for the class $$\mathcal M_B^K$$. It can be proved with a safe bet as in (a): short sell the capped reward $$\min\{X, T\}$$, as in the dashed line of the simulation. Agrawal, Juneja and Koolen (2021) give a policy that attains the Lai–Robbins bound for classes like $$\mathcal M_B$$; its index is $$K_{\inf}$$ with the moment constraint added.

## Reading

- J. Honda and A. Takemura, Non-asymptotic analysis of a new bandit algorithm for semi-bounded rewards, *Journal of Machine Learning Research* 16 (2015), 3721–3756: Part I.
- R. R. Bahadur and L. J. Savage, The nonexistence of certain statistical procedures in nonparametric problems, *Annals of Mathematical Statistics* 27 (1956), 1115–1122: Part II.
- S. Agrawal, S. Juneja and W. M. Koolen, Regret minimization in heavy-tailed bandits, *COLT* 2021: Part III.

<nav class="notes-nav" aria-label="Course notes"><a href="course-rl-2026-sheet-5.html">← Exercise Sheet 5</a><a href="course-rl-2026-lecture-6.html">Lecture 6 notes</a><a href="course-rl-2026-results.html">Results so far</a><a href="course-rl-2026.html">Course page</a></nav>
