---
layout: default
title: "Exercise Sheet 5"
description: "Exercise Sheet 5 for Advanced Probabilistic Methods Related to Reinforcement Learning (TU Berlin, Winter 2026/27): the Lai–Robbins constant for rewards in [0, 1], why Bernoulli arms are the hardest, deterministic and Bernoulli arms, and the Chernoff exponent as a relative entropy."
nav: "teaching"
body_class: "course notes"
math: true
---
# Exercise Sheet 5

[Advanced Probabilistic Methods Related to Reinforcement Learning](course-rl-2026.html) · TU Berlin · Winter 2026/27
{: .lede}

Notation as in the [Lecture 5 notes](course-rl-2026-lecture-5.html). Exercises marked <span class="tag">used later</span> are needed in later lectures. Click *Solution* under an exercise or part to reveal its solution.

As on [Sheet 4](course-rl-2026-sheet-4.html#exercise-4-1), $$\mathrm{kl}(p, q) = \mathrm{KL}(\mathrm{Ber}(p) \,\Vert\, \mathrm{Ber}(q)) = p \log\frac pq + (1 - p)\log\frac{1-p}{1-q}$$.

**Exercise 5.1 (the Lai–Robbins constant on [0, 1]).** <span class="tag">used later</span> <span class="used-in">in <a href="course-rl-2026-lecture-5.html#remark-5-3">Remark 5.3</a></span> Let $$\mu \in \mathcal M_{[0,1]}$$ and $$m \in [0, 1)$$.
{: #exercise-5-1}

(a) Show that $$K_{\inf}(\mu, m) < \infty$$. (*Hint:* mix $$\mu$$ with the point mass $$\delta_1$$ at $$1$$.)

<details class="solution" markdown="1">
<summary>Solution</summary>

If $$\mathrm{mean}(\mu) \ge m$$, then $$K_{\inf}(\mu, m) = 0$$. Otherwise $$\mathrm{mean}(\mu) < m < 1$$, so $$\theta = (m - \mathrm{mean}(\mu))/(1 - \mathrm{mean}(\mu)) \in (0, 1)$$; let $$\nu = (1-\theta)\mu + \theta\delta_1$$. Then $$\mathrm{mean}(\nu) = (1-\theta)\,\mathrm{mean}(\mu) + \theta = \mathrm{mean}(\mu) + \theta\,(1 - \mathrm{mean}(\mu)) = m$$. Moreover $$\nu(B) \ge (1-\theta)\mu(B)$$ for every Borel set $$B$$, so $$\mu \ll \nu$$, and $$d\mu/d\nu \le 1/(1-\theta)$$ $$\nu$$-almost surely: if $$B = \{d\mu/d\nu > 1/(1-\theta)\}$$ had $$\nu(B) > 0$$, then $$\mu(B) = \int_B \frac{d\mu}{d\nu}\, d\nu > \nu(B)/(1-\theta) \ge \mu(B)$$, a contradiction. Since $$\mu \ll \nu$$, the bound also holds $$\mu$$-almost surely, so

$$
K_{\inf}(\mu, m) \le \mathrm{KL}(\mu \,\Vert\, \nu) = \mathbb E_\mu\Big[\log\frac{d\mu}{d\nu}(X)\Big] \le \log\frac1{1-\theta} < \infty.
$$

</details>

(b) Let $$\nu \in \mathcal M_{[0,1]}$$ with $$\mathrm{mean}(\nu) \ge m$$, let $$\theta \in (0, 1)$$ and $$\nu_\theta = (1 - \theta)\nu + \theta\delta_1$$. Show that $$\mathrm{mean}(\nu_\theta) > m$$ and $$\mathrm{KL}(\mu \,\Vert\, \nu_\theta) \le \mathrm{KL}(\mu \,\Vert\, \nu) + \log\frac{1}{1 - \theta}$$.

<details class="solution" markdown="1">
<summary>Solution</summary>

Since $$\mathrm{mean}(\nu) \ge m$$, $$\theta > 0$$ and $$m < 1$$,

$$
\mathrm{mean}(\nu_\theta) = (1-\theta)\,\mathrm{mean}(\nu) + \theta \ge (1-\theta)m + \theta = m + \theta(1 - m) > m.
$$

For the relative entropy we may assume $$\mathrm{KL}(\mu \,\Vert\, \nu) < \infty$$, so $$\mu \ll \nu$$. Since $$\nu_\theta \ge (1-\theta)\nu$$, the argument of (a) gives $$\nu \ll \nu_\theta$$ with $$d\nu/d\nu_\theta \le 1/(1-\theta)$$ $$\nu_\theta$$-almost surely. So $$\mu \ll \nu_\theta$$, and since $$\mu(B) = \int_B \frac{d\mu}{d\nu}\, d\nu = \int_B \frac{d\mu}{d\nu}\frac{d\nu}{d\nu_\theta}\, d\nu_\theta$$ for every Borel set $$B$$, we have, $$\nu_\theta$$-almost surely and therefore $$\mu$$-almost surely,

$$
\frac{d\mu}{d\nu_\theta} = \frac{d\mu}{d\nu}\,\frac{d\nu}{d\nu_\theta} \le \frac{1}{1-\theta}\,\frac{d\mu}{d\nu}.
$$

Both sides are positive $$\mu$$-almost surely, so taking logarithms and $$\mathbb E_\mu$$ gives $$\mathrm{KL}(\mu \,\Vert\, \nu_\theta) \le \mathrm{KL}(\mu \,\Vert\, \nu) + \log\frac1{1-\theta}$$.

</details>

(c) Deduce [Remark 5.3](course-rl-2026-lecture-5.html#remark-5-3): if $$\nu = (\mu_1, \dots, \mu_K) \in \mathcal M_{[0,1]}^K$$ has largest mean $$m^* < 1$$, then $$d_a(\nu, \mathcal M_{[0,1]}) = K_{\inf}(\mu_a, m^*)$$ for every arm $$a$$ with $$\Delta_a > 0$$.

<details class="solution" markdown="1">
<summary>Solution</summary>

Write $$d_a = d_a(\nu, \mathcal M_{[0,1]})$$. By definition, $$d_a$$ is the infimum of $$\mathrm{KL}(\mu_a \,\Vert\, \mu')$$ over $$\mu' \in \mathcal M_{[0,1]}$$ with $$\mathrm{mean}(\mu') > m^*$$, and $$K_{\inf}(\mu_a, m^*)$$ is the same infimum over $$\mu'$$ with $$\mathrm{mean}(\mu') \ge m^*$$. The second infimum is over a larger set, so $$d_a \ge K_{\inf}(\mu_a, m^*)$$.

Conversely, let $$\nu' \in \mathcal M_{[0,1]}$$ with $$\mathrm{mean}(\nu') \ge m^*$$, and let $$\theta \in (0,1)$$. By (b) with $$m = m^* < 1$$, $$\nu'_\theta = (1-\theta)\nu' + \theta\delta_1$$ has mean larger than $$m^*$$, so it is admissible for $$d_a$$, and

$$
d_a \le \mathrm{KL}(\mu_a \,\Vert\, \nu'_\theta) \le \mathrm{KL}(\mu_a \,\Vert\, \nu') + \log\frac1{1-\theta}.
$$

Let $$\theta \downarrow 0$$, so that $$\log\frac1{1-\theta} \to 0$$, and take the infimum over $$\nu'$$: $$d_a \le K_{\inf}(\mu_a, m^*)$$.

</details>

(d) Let $$\nu \in \mathcal M_{[0,1]}$$. Show that $$\mathrm{kl}\big(\mathrm{mean}(\mu), \mathrm{mean}(\nu)\big) \le \mathrm{KL}(\mu \,\Vert\, \nu)$$. (*Hint:* if $$\mathrm{mean}(\nu) \in \{0, 1\}$$, then $$\nu$$ is a point mass. Otherwise you may assume $$\mu \ll \nu$$; apply Jensen's inequality for $$\varphi(x) = x \log x$$ to $$d\mu/d\nu$$, as in the proof of [Lemma 3.2](course-rl-2026-lecture-3.html#lemma-3-2), once under the probability measure $$x\,\nu(dx)/\mathrm{mean}(\nu)$$ and once under $$(1 - x)\,\nu(dx)/(1 - \mathrm{mean}(\nu))$$.)

<details class="solution" markdown="1">
<summary>Solution</summary>

Write $$p = \mathrm{mean}(\mu)$$ and $$q = \mathrm{mean}(\nu)$$; we may assume $$\mathrm{KL}(\mu \,\Vert\, \nu) < \infty$$, so $$\mu \ll \nu$$. If $$q = 0$$, then $$\nu = \delta_0$$, since a random variable $$X \ge 0$$ with $$\mathbb E[X] = 0$$ vanishes almost surely; similarly $$q = 1$$ forces $$\nu = \delta_1$$. In both cases $$\mu \ll \nu$$ forces $$\mu = \nu$$, so $$p = q$$ and both sides are $$0$$.

Otherwise $$q \in (0, 1)$$. Let $$\varphi(x) = x\log x$$, which is convex on $$[0, \infty)$$, with $$\varphi(0) = 0$$. Since $$x \in [0, 1]$$ on the support of $$\nu$$, the weights $$x$$ and $$1 - x$$ are nonnegative, so

$$
\nu^+(dx) = \frac{x\, \nu(dx)}{q} \qquad\text{and}\qquad \nu^-(dx) = \frac{(1-x)\, \nu(dx)}{1-q}
$$

are probability measures, with $$q\,\nu^+ + (1-q)\,\nu^- = \nu$$. Their means of $$d\mu/d\nu$$ are

$$
\mathbb E_{\nu^+}\Big[\frac{d\mu}{d\nu}(X)\Big] = \frac1q \int x\, \frac{d\mu}{d\nu}(x)\, \nu(dx) = \frac1q \int x\, \mu(dx) = \frac pq, \qquad \mathbb E_{\nu^-}\Big[\frac{d\mu}{d\nu}(X)\Big] = \frac{1-p}{1-q}.
$$

By Jensen's inequality under $$\nu^+$$ and under $$\nu^-$$ (the negative parts are integrable, as $$\varphi \ge -1/e$$),

$$
\mathrm{KL}(\mu \,\Vert\, \nu) = \mathbb E_\nu\Big[\varphi\Big(\frac{d\mu}{d\nu}(X)\Big)\Big] = q\, \mathbb E_{\nu^+}\Big[\varphi\Big(\frac{d\mu}{d\nu}(X)\Big)\Big] + (1-q)\, \mathbb E_{\nu^-}\Big[\varphi\Big(\frac{d\mu}{d\nu}(X)\Big)\Big] \ge q\, \varphi\Big(\frac pq\Big) + (1-q)\, \varphi\Big(\frac{1-p}{1-q}\Big),
$$

and $$q\, \varphi(p/q) + (1-q)\, \varphi((1-p)/(1-q)) = p\log\frac pq + (1-p)\log\frac{1-p}{1-q} = \mathrm{kl}(p, q)$$.

</details>

(e) Deduce that $$K_{\inf}(\mu, m) \ge \mathrm{kl}\big(\mathrm{mean}(\mu), m\big) \ge 2\big(m - \mathrm{mean}(\mu)\big)^2$$ if $$\mathrm{mean}(\mu) \le m$$, and hence that $$d_a(\nu, \mathcal M_{[0,1]}) \ge 2\Delta_a^2 > 0$$ in (c). So among reward distributions on $$[0, 1]$$ with a given mean, a Bernoulli arm is the hardest to tell apart from a better arm. Compare the number of pulls asked for by [Theorem 4.1](course-rl-2026-lecture-4.html#theorem-4-1) with the bound $$3 + 16\sigma^2\log n/\Delta_a^2$$ of [Theorem 2.6](course-rl-2026-lecture-2.html#theorem-2-6) for [UCB](course-rl-2026-lecture-2.html#algorithm-2-5), with $$\sigma = \frac12$$. (*Hint:* $$q \mapsto \mathrm{kl}(p, q)$$ is nondecreasing on $$[p, 1]$$; for the second inequality, use [Exercise 4.1](course-rl-2026-sheet-4.html#exercise-4-1)(a).)

<details class="solution" markdown="1">
<summary>Solution</summary>

Let $$p = \mathrm{mean}(\mu) \le m$$. The function $$q \mapsto \mathrm{kl}(p, q)$$ is nondecreasing on $$[p, 1]$$: on $$[p, 1)$$ its derivative is $$-\frac pq + \frac{1-p}{1-q} = \frac{q - p}{q(1-q)} \ge 0$$, and $$\mathrm{kl}(p, 1) = \infty$$ if $$p < 1$$. So for every $$\nu \in \mathcal M_{[0,1]}$$ with $$q = \mathrm{mean}(\nu) \ge m \ge p$$, (d) gives $$\mathrm{KL}(\mu \,\Vert\, \nu) \ge \mathrm{kl}(p, q) \ge \mathrm{kl}(p, m)$$. Taking the infimum over such $$\nu$$, and then using [Exercise 4.1(a)](course-rl-2026-sheet-4.html#exercise-4-1),

$$
K_{\inf}(\mu, m) \ge \mathrm{kl}(p, m) \ge 2(m - p)^2.
$$

In (c), $$\mathrm{mean}(\mu_a) = m^* - \Delta_a \le m^*$$, so $$d_a = K_{\inf}(\mu_a, m^*) \ge 2\Delta_a^2 > 0$$.

For $$\mu = \mathrm{Ber}(p)$$ the first inequality is an equality ([Exercise 5.2(b)](#exercise-5-2)), so among distributions on $$[0, 1]$$ with mean $$p$$ the Bernoulli one has the smallest $$K_{\inf}$$. For the comparison: [Theorem 4.1](course-rl-2026-lecture-4.html#theorem-4-1) shows that a consistent policy pulls arm $$a$$ at least about $$\log n/d_a$$ times, and $$\log n/d_a \le \log n/(2\Delta_a^2)$$. Rewards in $$[0, 1]$$ are $$\frac12$$-sub-Gaussian ([Lemma 1.9(b)](course-rl-2026-lecture-1.html#lemma-1-9)), so [Theorem 2.6](course-rl-2026-lecture-2.html#theorem-2-6) with $$\sigma = \frac12$$ gives at most $$3 + 4\log n/\Delta_a^2$$ pulls for [UCB](course-rl-2026-lecture-2.html#algorithm-2-5). The leading terms differ by a factor $$4 / \frac12 = 8$$ when $$d_a \approx 2\Delta_a^2$$, as for Bernoulli arms with means near $$\frac12$$ (there $$\mathrm{kl}(p, m) \approx (m - p)^2/(2p(1-p)) = 2(m-p)^2$$). When $$d_a$$ is much larger than $$2\Delta_a^2$$, as for Bernoulli arms with means near $$1$$ ([Exercise 4.1(c)](course-rl-2026-sheet-4.html#exercise-4-1)) or deterministic arms ([Exercise 5.2(a)](#exercise-5-2)), UCB pulls arm $$a$$ far more often than necessary.

</details>

(f) Where did you use in (d) that $$\mu$$ and $$\nu$$ live on $$[0, 1]$$? Show that (e) fails for distributions on $$[0, \infty)$$: if $$\mu$$ has finite mean, $$t \in (0, 1)$$ and $$M > 0$$, then $$\nu_t = (1 - t)\mu + t\delta_M$$ satisfies $$\mathrm{KL}(\mu \,\Vert\, \nu_t) \le \log\frac{1}{1 - t}$$ and $$\mathrm{mean}(\nu_t) = (1 - t)\,\mathrm{mean}(\mu) + tM$$.

<details class="solution" markdown="1">
<summary>Solution</summary>

In (d), $$\nu^+$$ and $$\nu^-$$ are (nonnegative) probability measures only because $$\nu$$ lives on $$[0, 1]$$; for $$\mu$$, $$[0, 1]$$ was used only to make $$p \in [0, 1]$$. Now let $$\mu$$ be a probability measure on $$[0, \infty)$$ with finite mean, $$t \in (0, 1)$$, $$M > 0$$ and $$\nu_t = (1-t)\mu + t\delta_M$$. Then $$\nu_t \ge (1-t)\mu$$, so, as in (a), $$d\mu/d\nu_t \le 1/(1-t)$$ $$\mu$$-almost surely and $$\mathrm{KL}(\mu \,\Vert\, \nu_t) \le \log\frac1{1-t}$$; and $$\mathrm{mean}(\nu_t) = (1-t)\,\mathrm{mean}(\mu) + tM$$. Given $$m > \mathrm{mean}(\mu)$$ and $$t \in (0,1)$$, choosing $$M \ge m/t$$ makes $$\mathrm{mean}(\nu_t) \ge m$$. So the infimum of $$\mathrm{KL}(\mu \,\Vert\, \nu)$$ over probability measures $$\nu$$ on $$[0, \infty)$$ with $$\mathrm{mean}(\nu) \ge m$$ is at most $$\log\frac1{1-t}$$ for every $$t \in (0,1)$$, hence $$0$$, and no lower bound like $$2(m - \mathrm{mean}(\mu))^2$$ can hold.

</details>

**Exercise 5.2 (deterministic and Bernoulli arms).** Let $$0 \le p \le m < 1$$.
{: #exercise-5-2}

(a) Show that $$K_{\inf}(\delta_p, m) = \log\frac{1 - p}{1 - m}$$, once from [Lemma 5.4](course-rl-2026-lecture-5.html#lemma-5-4) and once directly, by finding the $$\nu$$ that attains the infimum in the definition of $$K_{\inf}(\delta_p, m)$$. Compare with $$2(m - p)^2$$ as $$m \downarrow p$$.

<details class="solution" markdown="1">
<summary>Solution</summary>

*From [Lemma 5.4](course-rl-2026-lecture-5.html#lemma-5-4).* With $$\mu = \delta_p$$, $$\varphi_{\mu,m}(\lambda) = \log(1 + \lambda(m - p))$$ for $$\lambda \in [0, \Lambda_m]$$, where $$\Lambda_m = 1/(1-m)$$. This is nondecreasing in $$\lambda$$, since $$m \ge p$$, so its maximum is at $$\Lambda_m$$, and by [Lemma 5.4](course-rl-2026-lecture-5.html#lemma-5-4)

$$
K_{\inf}(\delta_p, m) = \varphi_{\mu,m}(\Lambda_m) = \log\Big(1 + \frac{m - p}{1 - m}\Big) = \log\frac{1-p}{1-m}.
$$

*Directly.* We look for the $$\nu$$ attaining the infimum in $$K_{\inf}(\delta_p, m)$$. We have $$\delta_p \ll \nu$$ exactly when $$w = \nu(\{p\}) > 0$$, and then $$\frac{d\delta_p}{d\nu}(p) = \frac1w$$, so $$\mathrm{KL}(\delta_p \,\Vert\, \nu) = \log\frac1w$$. So we must make $$w$$ as large as possible subject to $$\mathrm{mean}(\nu) \ge m$$. The remaining mass $$1 - w$$ sits in $$[0, 1]$$, so $$\mathrm{mean}(\nu) \le wp + (1-w)$$, and $$\mathrm{mean}(\nu) \ge m$$ forces $$wp + 1 - w \ge m$$, that is, $$w \le \frac{1-m}{1-p}$$. This bound is attained by $$\nu = w\delta_p + (1-w)\delta_1$$ with $$w = \frac{1-m}{1-p}$$, which has mean exactly $$m$$; the minimiser moves mass $$1 - w$$ to $$1$$. Hence $$K_{\inf}(\delta_p, m) = \log\frac{1-p}{1-m}$$ again.

*Comparison.* Write $$\log\frac{1-p}{1-m} = -\log\big(1 - \frac{m-p}{1-p}\big)$$. Since $$-\log(1 - y) = y + O(y^2)$$ as $$y \to 0$$, as $$m \downarrow p$$ we get $$K_{\inf}(\delta_p, m) = \frac{m - p}{1 - p} + O((m-p)^2)$$, which is linear in the gap $$m - p$$, while $$2(m-p)^2$$ is quadratic. A deterministic arm is much easier to tell apart from a better arm than the bound of [Exercise 5.1(e)](#exercise-5-1) suggests.

</details>

(b) For $$\mu = \mathrm{Ber}(p)$$, find the maximiser of $$\varphi_{\mu,m}$$, and deduce from [Lemma 5.4](course-rl-2026-lecture-5.html#lemma-5-4) that $$K_{\inf}(\mathrm{Ber}(p), m) = \mathrm{kl}(p, m)$$.

<details class="solution" markdown="1">
<summary>Solution</summary>

If $$p = m$$, then $$\mathrm{mean}(\mu) = m$$, so both sides are $$0$$. Let $$p < m$$, so $$m > 0$$. Since $$\mu = \mathrm{Ber}(p)$$,

$$
\varphi_{\mu,m}(\lambda) = (1-p)\log(1 + \lambda m) + p\log\big(1 - \lambda(1-m)\big), \qquad \lambda \in [0, \Lambda_m].
$$

This is concave, as a sum of logarithms of affine functions, with

$$
\varphi_{\mu,m}'(\lambda) = \frac{(1-p)m}{1 + \lambda m} - \frac{p(1-m)}{1 - \lambda(1-m)}.
$$

Setting this to $$0$$ and clearing denominators, $$(1-p)m\big(1 - \lambda(1-m)\big) = p(1-m)(1 + \lambda m)$$, that is, $$m - p = \lambda\, m(1-m)$$. So $$\varphi_{\mu,m}'$$ vanishes at $$\lambda^* = \frac{m - p}{m(1-m)}$$, and $$\lambda^* \le \Lambda_m = \frac1{1-m}$$ because $$\frac{m - p}{m} \le 1$$. A critical point of a concave function is a maximiser. (If $$p = 0$$, then $$\lambda^* = \Lambda_m$$, and $$\varphi_{\mu,m}' > 0$$ on $$[0, \Lambda_m)$$, so the maximum is again at $$\lambda^*$$.) At $$\lambda^*$$,

$$
1 + \lambda^* m = 1 + \frac{m-p}{1-m} = \frac{1-p}{1-m}, \qquad 1 - \lambda^*(1-m) = 1 - \frac{m-p}{m} = \frac pm,
$$

so by [Lemma 5.4](course-rl-2026-lecture-5.html#lemma-5-4)

$$
K_{\inf}(\mathrm{Ber}(p), m) = \varphi_{\mu,m}(\lambda^*) = (1-p)\log\frac{1-p}{1-m} + p\log\frac pm = \mathrm{kl}(p, m).
$$

</details>

**Exercise 5.3 (the Chernoff exponent is a relative entropy).** Let $$\mu$$ be a probability measure on $$\mathbb R$$ such that $$L(\lambda) = \log \mathbb E_\mu[e^{\lambda X}]$$, the logarithm of the moment generating function of $$\mu$$, is finite for all $$\lambda \in \mathbb R$$. For $$\lambda \in \mathbb R$$ let $$\mu_\lambda(dx) = e^{\lambda x - L(\lambda)}\, \mu(dx)$$. This is a probability measure, since $$e^{L(\lambda)} = \mathbb E_\mu[e^{\lambda X}]$$; it is called an *exponential tilt* of $$\mu$$, because it reweights $$\mu$$ by $$e^{\lambda x}$$, favouring large values of $$x$$ when $$\lambda > 0$$ and small ones when $$\lambda < 0$$.
{: #exercise-5-3}

(a) Show that $$\lambda\, \mathrm{mean}(\nu) - \mathrm{KL}(\nu \,\Vert\, \mu) \le L(\lambda)$$ for every probability measure $$\nu$$ on $$\mathbb R$$ with finite mean and $$\mathrm{KL}(\nu \,\Vert\, \mu) < \infty$$, with equality for $$\nu = \mu_\lambda$$. (*Hint:* $$\mathrm{KL}(\nu \,\Vert\, \mu_\lambda) \ge 0$$, [Lemma 3.2](course-rl-2026-lecture-3.html#lemma-3-2).)

<details class="solution" markdown="1">
<summary>Solution</summary>

Fix $$\lambda$$. We may assume $$\mathrm{KL}(\nu \,\Vert\, \mu) < \infty$$, so $$\nu \ll \mu$$. By definition, $$\mu_\lambda$$ has density $$\frac{d\mu_\lambda}{d\mu}(x) = e^{\lambda x - L(\lambda)} > 0$$ with respect to $$\mu$$, so $$\mu$$ and $$\mu_\lambda$$ have the same null sets. Hence $$\nu \ll \mu_\lambda$$, with

$$
\frac{d\nu}{d\mu_\lambda}(x) = \frac{d\nu}{d\mu}(x) \Big/ \frac{d\mu_\lambda}{d\mu}(x) = \frac{d\nu}{d\mu}(x)\, e^{-\lambda x + L(\lambda)}.
$$

Taking $$\mathbb E_\nu$$ of the logarithm, which we may split because $$\nu$$ has finite mean, and using $$\mathrm{KL}(\nu \,\Vert\, \mu_\lambda) \ge 0$$ ([Lemma 3.2](course-rl-2026-lecture-3.html#lemma-3-2)),

$$
0 \le \mathrm{KL}(\nu \,\Vert\, \mu_\lambda) = \mathbb E_\nu\Big[\log\frac{d\nu}{d\mu}(X) - \lambda X + L(\lambda)\Big] = \mathrm{KL}(\nu \,\Vert\, \mu) - \lambda\, \mathrm{mean}(\nu) + L(\lambda),
$$

which rearranges to the claim. For $$\nu = \mu_\lambda$$ the left-hand side is $$\mathrm{KL}(\mu_\lambda \,\Vert\, \mu_\lambda) = 0$$, so there is equality. This $$\nu$$ satisfies the assumptions: it has finite mean, since $$\lvert x\rvert \le e^x + e^{-x}$$ gives $$\mathbb E_{\mu_\lambda}\lvert X\rvert \le e^{L(\lambda + 1) - L(\lambda)} + e^{L(\lambda - 1) - L(\lambda)} < \infty$$, and then $$\mathrm{KL}(\mu_\lambda \,\Vert\, \mu) = \mathbb E_{\mu_\lambda}[\lambda X - L(\lambda)] = \lambda\, \mathrm{mean}(\mu_\lambda) - L(\lambda) < \infty$$.

</details>

(b) Deduce that for every $$x \in \mathbb R$$, $$\sup_\lambda (\lambda x - L(\lambda)) \le \inf\{\mathrm{KL}(\nu \,\Vert\, \mu) : \mathrm{mean}(\nu) = x\}$$, with equality if $$\mathrm{mean}(\mu_\lambda) = x$$ for some $$\lambda$$.

<details class="solution" markdown="1">
<summary>Solution</summary>

*The inequality.* Let $$\nu$$ have $$\mathrm{mean}(\nu) = x$$. If $$\mathrm{KL}(\nu \,\Vert\, \mu) = \infty$$ there is nothing to show; otherwise (a) gives $$\lambda x - L(\lambda) \le \mathrm{KL}(\nu \,\Vert\, \mu)$$ for every $$\lambda$$. Taking the supremum over $$\lambda$$ and then the infimum over $$\nu$$,

$$
\sup_\lambda \big(\lambda x - L(\lambda)\big) \le \inf\{\mathrm{KL}(\nu \,\Vert\, \mu) : \mathrm{mean}(\nu) = x\}.
$$

*Equality.* Suppose $$\mathrm{mean}(\mu_{\lambda_0}) = x$$ for some $$\lambda_0$$. Then $$\mu_{\lambda_0}$$ is one of the $$\nu$$ in the infimum, and its relative entropy can be computed directly: $$\log\frac{d\mu_{\lambda_0}}{d\mu}(X) = \lambda_0 X - L(\lambda_0)$$, so

$$
\mathrm{KL}(\mu_{\lambda_0} \,\Vert\, \mu) = \mathbb E_{\mu_{\lambda_0}}\big[\lambda_0 X - L(\lambda_0)\big] = \lambda_0 x - L(\lambda_0) \le \sup_\lambda \big(\lambda x - L(\lambda)\big).
$$

Hence the infimum is at most the supremum, and the two are equal. Moreover the supremum is attained at $$\lambda_0$$, and the infimum at $$\nu = \mu_{\lambda_0}$$: among all measures with mean $$x$$, the exponential tilt $$\mu_{\lambda_0}$$ is the closest to $$\mu$$ in relative entropy.

</details>

<nav class="notes-nav" aria-label="Course notes"><a href="course-rl-2026-sheet-4.html">← Exercise Sheet 4</a><a href="course-rl-2026-lecture-5.html">Lecture 5 notes</a><a href="course-rl-2026-results.html">Results so far</a><a href="course-rl-2026.html">Course page</a></nav>
