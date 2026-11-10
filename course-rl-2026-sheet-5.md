---
layout: default
title: "Exercise Sheet 5"
description: "Exercise Sheet 5 for Advanced Probabilistic Methods Related to Reinforcement Learning (TU Berlin, Winter 2026/27): the Lai–Robbins constant on [0, 1], deterministic and Bernoulli arms, why the bets must be mixed, anytime Hoeffding bounds, and the Chernoff exponent as a relative entropy."
nav: "teaching"
body_class: "course notes"
math: true
---
# Exercise Sheet 5

[Advanced Probabilistic Methods Related to Reinforcement Learning](course-rl-2026.html) · TU Berlin · Winter 2026/27
{: .lede}

Notation as in the [Lecture 5 notes](course-rl-2026-lecture-5.html). Exercises marked <span class="tag">used later</span> are needed in later lectures.

[Exercise 5.2(c)](#exercise-5-2) uses *Pinsker's inequality*, stated on Sheet 4 and not yet proved: for probability measures $$P$$ and $$Q$$ on a common space and every event $$A$$, $$\vert P(A) - Q(A)\vert \le \sqrt{\mathrm{KL}(P \,\Vert\, Q)/2}$$. We write $$\mathrm{kl}(p, q) = \mathrm{KL}(\mathrm{Ber}(p) \,\Vert\, \mathrm{Ber}(q)) = p \log\frac pq + (1 - p)\log\frac{1-p}{1-q}$$.

**Exercise 5.1 (the Lai–Robbins constant on [0, 1]).** <span class="tag">used later</span> <span class="used-in">in <a href="course-rl-2026-lecture-5.html#remark-5-3">Remark 5.3</a></span> Let $$\mu \in \mathcal M_{[0,1]}$$ and $$m \in [0, 1)$$.
{: #exercise-5-1}

(a) Show that $$K_{\inf}(\mu, m) < \infty$$. (Hint: mix $$\mu$$ with an atom at $$1$$.)

(b) Let $$\nu \in \mathcal M_{[0,1]}$$ with $$\mathrm{mean}(\nu) \ge m$$, let $$\theta \in (0, 1)$$ and $$\nu_\theta = (1 - \theta)\nu + \theta\delta_1$$. Show that $$\mathrm{mean}(\nu_\theta) > m$$ and $$\mathrm{KL}(\mu \,\Vert\, \nu_\theta) \le \mathrm{KL}(\mu \,\Vert\, \nu) + \log\frac{1}{1 - \theta}$$.

(c) Deduce [Remark 5.3](course-rl-2026-lecture-5.html#remark-5-3): if $$\nu = (\mu_1, \dots, \mu_K) \in \mathcal M_{[0,1]}^K$$ has largest mean $$m^* < 1$$, then $$d_a(\nu, \mathcal M_{[0,1]}) = K_{\inf}(\mu_a, m^*)$$ for every arm $$a$$ with $$\Delta_a > 0$$.

**Exercise 5.2 (deterministic and Bernoulli arms).** Let $$0 \le p \le m < 1$$.
{: #exercise-5-2}

(a) Show that $$K_{\inf}(\delta_p, m) = \log\frac{1 - p}{1 - m}$$, once from [Lemma 5.4](course-rl-2026-lecture-5.html#lemma-5-4) and once by finding the closest alternative directly. Compare with $$2(m - p)^2$$ as $$m \downarrow p$$.

(b) For $$\mu = \mathrm{Ber}(p)$$, find the maximiser of $$\varphi_{\mu,m}$$, and deduce from [Lemma 5.4](course-rl-2026-lecture-5.html#lemma-5-4) that $$K_{\inf}(\mathrm{Ber}(p), m) = \mathrm{kl}(p, m)$$.

(c) Using $$X = \int_0^1 \mathbf 1\{X > u\}\, du$$ for $$X \in [0, 1]$$ and Pinsker's inequality, show that $$\vert\mathrm{mean}(\mu) - \mathrm{mean}(\nu)\vert \le \sqrt{\mathrm{KL}(\mu \,\Vert\, \nu)/2}$$ for $$\mu, \nu \in \mathcal M_{[0,1]}$$. Deduce that $$K_{\inf}(\mu, m) \ge 2(m - \mathrm{mean}(\mu))^2$$ whenever $$\mathrm{mean}(\mu) \le m$$, and compare the number of pulls asked for by [Theorem 4.1](course-rl-2026-lecture-4.html#theorem-4-1) with the bound $$3 + 16\sigma^2\log n/\Delta_a^2$$ of [Theorem 2.6](course-rl-2026-lecture-2.html#theorem-2-6) for [UCB](course-rl-2026-lecture-2.html#algorithm-2-5), with $$\sigma = \frac12$$.

**Exercise 5.3 (why mix?).**
{: #exercise-5-3}

(a) Let $$\mu = \mathrm{Ber}(m)$$ with $$m \in (0, 1)$$, and let $$B_1(m)$$ be the best wealth in hindsight after one price drawn from $$\mu$$. Show that $$\mathbb E[B_1(m)] = 1 + m$$. So $$(B_s(m))_{s \ge 0}$$ is not a supermartingale.

(b) Find the error in the following argument: "For each $$\lambda$$, $$(W_s(\lambda, m))_{s \ge 0}$$ is a nonnegative martingale with $$W_0(\lambda, m) = 1$$, so by [Lemma 5.5](course-rl-2026-lecture-5.html#lemma-5-5), $$\mathbb P(B_s(m) \ge x \text{ for some } s) \le 1/x$$."

(c) Compute both sides of [Lemma 5.6](course-rl-2026-lecture-5.html#lemma-5-6) when $$x_1 = \dots = x_s = 0$$, and show that the factor $$1/(s + 1)$$ cannot be replaced by a constant independent of $$s$$.

**Exercise 5.4 (anytime Hoeffding).** Let $$X_1, X_2, \dots$$ be i.i.d. and $$\sigma$$-sub-Gaussian with mean $$m$$, and let $$S_s = (X_1 - m) + \dots + (X_s - m)$$.
{: #exercise-5-4}

(a) Show that for each $$\lambda \in \mathbb R$$, $$\exp(\lambda S_s - s\lambda^2\sigma^2/2)$$ is a nonnegative supermartingale equal to $$1$$ at $$s = 0$$.

(b) For $$\rho > 0$$, average (a) over $$\lambda$$ with the $$N(0, 1/\rho)$$ density, and show that the result is the nonnegative supermartingale

$$
M_s = \sqrt{\frac{\rho}{\rho + s\sigma^2}}\, \exp\Big(\frac{S_s^2}{2(\rho + s\sigma^2)}\Big).
$$

(c) Deduce that with probability at least $$1 - \delta$$, for all $$s \ge 1$$ simultaneously,

$$
\vert S_s\vert \le \sqrt{2(\rho + s\sigma^2) \log\Big(\frac{\sqrt{1 + s\sigma^2/\rho}}{\delta}\Big)}.
$$

(d) Compare with [Theorem 1.10](course-rl-2026-lecture-1.html#theorem-1-10) and a union bound over $$s \in [n]$$, as used for [UCB](course-rl-2026-lecture-2.html#algorithm-2-5) in Lecture 2. Which is smaller when $$s$$ is much smaller than $$n$$?

**Exercise 5.5 (the Chernoff exponent is a relative entropy).** Let $$\mu$$ be a probability measure on $$\mathbb R$$ with $$L(\lambda) = \log \mathbb E_\mu[e^{\lambda X}]$$ finite for all $$\lambda \in \mathbb R$$, and for $$\lambda \in \mathbb R$$ let $$\mu_\lambda(dx) = e^{\lambda x - L(\lambda)}\, \mu(dx)$$, the exponential tilt of $$\mu$$.
{: #exercise-5-5}

(a) Show that $$\lambda\, \mathrm{mean}(\nu) - \mathrm{KL}(\nu \,\Vert\, \mu) \le L(\lambda)$$ for every probability measure $$\nu$$ on $$\mathbb R$$ with finite mean and $$\mathrm{KL}(\nu \,\Vert\, \mu) < \infty$$, with equality for $$\nu = \mu_\lambda$$. (Hint: $$\mathrm{KL}(\nu \,\Vert\, \mu_\lambda) \ge 0$$, [Lemma 3.2](course-rl-2026-lecture-3.html#lemma-3-2).)

(b) Deduce that $$\sup_\lambda (\lambda x - L(\lambda))$$, the exponent of the Chernoff bound for $$\mathbb P(\hat m_s \ge x)$$, is at most $$\inf\{\mathrm{KL}(\nu \,\Vert\, \mu) : \mathrm{mean}(\nu) = x\}$$, with equality if $$\mathrm{mean}(\mu_\lambda) = x$$ for some $$\lambda$$.

(c) In this formula the alternative comes first in the KL, while in $$K_{\inf}$$ the truth comes first. Which error of a bandit policy does each describe?

<nav class="notes-nav" aria-label="Course notes"><a href="course-rl-2026-sheet-4.html">← Exercise Sheet 4</a><a href="course-rl-2026-lecture-5.html">Lecture 5 notes</a><a href="course-rl-2026-results.html">Results so far</a><a href="course-rl-2026.html">Course page</a></nav>
