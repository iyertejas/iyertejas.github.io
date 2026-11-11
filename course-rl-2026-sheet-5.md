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

Notation as in the [Lecture 5 notes](course-rl-2026-lecture-5.html). Exercises marked <span class="tag">used later</span> are needed in later lectures.

As on [Sheet 4](course-rl-2026-sheet-4.html#exercise-4-1), $$\mathrm{kl}(p, q) = \mathrm{KL}(\mathrm{Ber}(p) \,\Vert\, \mathrm{Ber}(q)) = p \log\frac pq + (1 - p)\log\frac{1-p}{1-q}$$.

**Exercise 5.1 (the Lai–Robbins constant on [0, 1]).** <span class="tag">used later</span> <span class="used-in">in <a href="course-rl-2026-lecture-5.html#remark-5-3">Remark 5.3</a></span> Let $$\mu \in \mathcal M_{[0,1]}$$ and $$m \in [0, 1)$$.
{: #exercise-5-1}

(a) Show that $$K_{\inf}(\mu, m) < \infty$$. (*Hint:* mix $$\mu$$ with an atom at $$1$$.)

(b) Let $$\nu \in \mathcal M_{[0,1]}$$ with $$\mathrm{mean}(\nu) \ge m$$, let $$\theta \in (0, 1)$$ and $$\nu_\theta = (1 - \theta)\nu + \theta\delta_1$$. Show that $$\mathrm{mean}(\nu_\theta) > m$$ and $$\mathrm{KL}(\mu \,\Vert\, \nu_\theta) \le \mathrm{KL}(\mu \,\Vert\, \nu) + \log\frac{1}{1 - \theta}$$.

(c) Deduce [Remark 5.3](course-rl-2026-lecture-5.html#remark-5-3): if $$\nu = (\mu_1, \dots, \mu_K) \in \mathcal M_{[0,1]}^K$$ has largest mean $$m^* < 1$$, then $$d_a(\nu, \mathcal M_{[0,1]}) = K_{\inf}(\mu_a, m^*)$$ for every arm $$a$$ with $$\Delta_a > 0$$.

(d) Let $$\nu \in \mathcal M_{[0,1]}$$. Show that $$\mathrm{kl}\big(\mathrm{mean}(\mu), \mathrm{mean}(\nu)\big) \le \mathrm{KL}(\mu \,\Vert\, \nu)$$. (*Hint:* if $$\mathrm{mean}(\nu) \in \{0, 1\}$$, then $$\nu$$ is a point mass. Otherwise you may assume $$\mu \ll \nu$$; let $$L = d\mu/d\nu$$ and apply Jensen's inequality for $$\varphi(x) = x \log x$$, as in the proof of [Lemma 3.2](course-rl-2026-lecture-3.html#lemma-3-2), once under the probability measure $$x\,\nu(dx)/\mathrm{mean}(\nu)$$ and once under $$(1 - x)\,\nu(dx)/(1 - \mathrm{mean}(\nu))$$.)

(e) Deduce that $$K_{\inf}(\mu, m) \ge \mathrm{kl}\big(\mathrm{mean}(\mu), m\big) \ge 2\big(m - \mathrm{mean}(\mu)\big)^2$$ if $$\mathrm{mean}(\mu) \le m$$, and hence that $$d_a(\nu, \mathcal M_{[0,1]}) \ge 2\Delta_a^2 > 0$$ in (c). So among reward distributions on $$[0, 1]$$ with a given mean, a Bernoulli arm is the hardest to tell apart from a better arm. Compare the number of pulls asked for by [Theorem 4.1](course-rl-2026-lecture-4.html#theorem-4-1) with the bound $$3 + 16\sigma^2\log n/\Delta_a^2$$ of [Theorem 2.6](course-rl-2026-lecture-2.html#theorem-2-6) for [UCB](course-rl-2026-lecture-2.html#algorithm-2-5), with $$\sigma = \frac12$$. (*Hint:* $$q \mapsto \mathrm{kl}(p, q)$$ is nondecreasing on $$[p, 1]$$; for the second inequality, use [Exercise 4.1](course-rl-2026-sheet-4.html#exercise-4-1)(a).)

(f) Where did you use in (d) that $$\mu$$ and $$\nu$$ live on $$[0, 1]$$? Show that (e) fails for distributions on $$[0, \infty)$$: if $$\mu$$ has finite mean, $$t \in (0, 1)$$ and $$M > 0$$, then $$\nu_t = (1 - t)\mu + t\delta_M$$ satisfies $$\mathrm{KL}(\mu \,\Vert\, \nu_t) \le \log\frac{1}{1 - t}$$ and $$\mathrm{mean}(\nu_t) = (1 - t)\,\mathrm{mean}(\mu) + tM$$.

**Exercise 5.2 (deterministic and Bernoulli arms).** Let $$0 \le p \le m < 1$$.
{: #exercise-5-2}

(a) Show that $$K_{\inf}(\delta_p, m) = \log\frac{1 - p}{1 - m}$$, once from [Lemma 5.4](course-rl-2026-lecture-5.html#lemma-5-4) and once by finding the closest alternative directly. Compare with $$2(m - p)^2$$ as $$m \downarrow p$$.

(b) For $$\mu = \mathrm{Ber}(p)$$, find the maximiser of $$\varphi_{\mu,m}$$, and deduce from [Lemma 5.4](course-rl-2026-lecture-5.html#lemma-5-4) that $$K_{\inf}(\mathrm{Ber}(p), m) = \mathrm{kl}(p, m)$$.

**Exercise 5.3 (the Chernoff exponent is a relative entropy).** Let $$\mu$$ be a probability measure on $$\mathbb R$$ with $$L(\lambda) = \log \mathbb E_\mu[e^{\lambda X}]$$ finite for all $$\lambda \in \mathbb R$$, and for $$\lambda \in \mathbb R$$ let $$\mu_\lambda(dx) = e^{\lambda x - L(\lambda)}\, \mu(dx)$$, the exponential tilt of $$\mu$$.
{: #exercise-5-3}

(a) Show that $$\lambda\, \mathrm{mean}(\nu) - \mathrm{KL}(\nu \,\Vert\, \mu) \le L(\lambda)$$ for every probability measure $$\nu$$ on $$\mathbb R$$ with finite mean and $$\mathrm{KL}(\nu \,\Vert\, \mu) < \infty$$, with equality for $$\nu = \mu_\lambda$$. (*Hint:* $$\mathrm{KL}(\nu \,\Vert\, \mu_\lambda) \ge 0$$, [Lemma 3.2](course-rl-2026-lecture-3.html#lemma-3-2).)

(b) Deduce that $$\sup_\lambda (\lambda x - L(\lambda))$$, the exponent of the Chernoff bound for $$\mathbb P(\hat m_s \ge x)$$, is at most $$\inf\{\mathrm{KL}(\nu \,\Vert\, \mu) : \mathrm{mean}(\nu) = x\}$$, with equality if $$\mathrm{mean}(\mu_\lambda) = x$$ for some $$\lambda$$.

<nav class="notes-nav" aria-label="Course notes"><a href="course-rl-2026-sheet-4.html">← Exercise Sheet 4</a><a href="course-rl-2026-lecture-5.html">Lecture 5 notes</a><a href="course-rl-2026-results.html">Results so far</a><a href="course-rl-2026.html">Course page</a></nav>
