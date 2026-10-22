---
layout: default
title: "Results so far"
description: "Every numbered definition, algorithm and result of Advanced Probabilistic Methods Related to Reinforcement Learning (TU Berlin, Winter 2026/27), with a one-line statement and a link to the notes."
nav: "teaching"
body_class: "course notes"
math: true
---
# Results so far

[Advanced Probabilistic Methods Related to Reinforcement Learning](course-rl-2026.html) · TU Berlin · Winter 2026/27
{: .lede}

Every numbered definition, algorithm and result from the lecture notes, in one line each, with a link to the full statement. Conditions are abbreviated; the notes have the precise hypotheses.

## Lecture 1: Stochastic bandits and concentration

- [Definition 1.1](course-rl-2026-lecture-1.html#definition-1-1) (stochastic bandit model). Arms with reward laws $$\mu_1, \dots, \mu_K$$ and means $$m_a$$; given the past and the arm pulled, the reward has law $$\mu_{A_t}$$. Best mean $$m^* = \max_a m_a$$, gaps $$\Delta_a = m^* - m_a$$.
- [Remark 1.2](course-rl-2026-lecture-1.html#remark-1-2) (stationarity). The laws $$\mu_a$$ do not change over time.
- [Definition 1.3](course-rl-2026-lecture-1.html#definition-1-3) (policy). Kernels $$\pi_t(a, h)$$ with $$\mathbb P(A_t = a \mid H_{t-1}) = \pi_t(a, H_{t-1})$$.
- [Example 1.4](course-rl-2026-lecture-1.html#example-1-4) (policies). Always arm 1; uniformly random; each arm once, then the best average.
- [Definition 1.5](course-rl-2026-lecture-1.html#definition-1-5) (regret). $$R_n(\pi) = n\, m^* - \mathbb E_\pi\big[\sum_{t \le n} X_t\big]$$.
- [Lemma 1.6](course-rl-2026-lecture-1.html#lemma-1-6) (regret decomposition). $$R_n(\pi) = \sum_a \Delta_a\, \mathbb E_\pi[N_a(n)]$$.
- [Remark 1.7](course-rl-2026-lecture-1.html#remark-1-7). Lemma 1.6 only uses the mean of $$X_t$$ given the past and the current arm.
- [Definition 1.8](course-rl-2026-lecture-1.html#definition-1-8) (sub-Gaussian). $$\mathbb E\big[e^{\lambda(X - m)}\big] \le e^{\lambda^2 \sigma^2/2}$$ for all $$\lambda \in \mathbb R$$.
- [Lemma 1.9](course-rl-2026-lecture-1.html#lemma-1-9) (examples). $$N(m, \sigma^2)$$ is $$\sigma$$-sub-Gaussian; values in $$[a, b]$$ give $$\frac{b-a}{2}$$; scaling by $$c$$ gives $$\lvert c\rvert\sigma$$; independent sums give $$\sqrt{\sigma_1^2 + \sigma_2^2}$$.
- [Theorem 1.10](course-rl-2026-lecture-1.html#theorem-1-10) (Chernoff bound). For $$s$$ independent $$\sigma$$-sub-Gaussian samples, $$\mathbb P(\hat m_s - m \ge \varepsilon) \le e^{-s\varepsilon^2/(2\sigma^2)}$$, and the same for the lower tail.
- [Corollary 1.11](course-rl-2026-lecture-1.html#corollary-1-11) (confidence intervals). With probability at least $$1 - \delta$$, $$\hat m_s < m + \sqrt{2\sigma^2 \log(1/\delta)/s}$$.

## Lecture 2: Explore-then-commit and UCB

- [Definition 2.1](course-rl-2026-lecture-2.html#definition-2-1) (policy function). $$f_t(h, x)$$ is the arm whose piece of $$[0, 1)$$, of length $$\pi_t(a, h)$$, contains $$x$$.
- [Definition 2.2](course-rl-2026-lecture-2.html#definition-2-2) (reward table). $$A_t = f_t(H_{t-1}, U_t)$$ and $$X_t = Y_{A_t, N_{A_t}(t)}$$, with independent decks $$Y_{a,s} \sim \mu_a$$; this is the same model as Definition 1.1.
- [Algorithm 2.3](course-rl-2026-lecture-2.html#algorithm-2-3) (explore-then-commit). Play each arm $$\ell$$ times, then commit to the best empirical mean.
- [Theorem 2.4](course-rl-2026-lecture-2.html#theorem-2-4) (ETC). For $$\sigma$$-sub-Gaussian rewards, $$R_n \le \ell \sum_a \Delta_a + n \sum_a \Delta_a e^{-\ell\Delta_a^2/(4\sigma^2)}$$; with $$\ell_{\min} = \lceil (4\sigma^2/\Delta_{\min}^2)\log n \rceil$$, $$R_n \le \sum_a \Delta_a \big(\frac{4\sigma^2\log n}{\Delta_{\min}^2} + 2\big)$$.
- [Algorithm 2.5](course-rl-2026-lecture-2.html#algorithm-2-5) (UCB). Play an arm maximising $$\hat m_a + \sqrt{2\sigma^2\log(1/\delta)/N_a}$$.
- [Theorem 2.6](course-rl-2026-lecture-2.html#theorem-2-6) (UCB). For $$\sigma$$-sub-Gaussian rewards and $$\delta = 1/n^2$$, $$\mathbb E[N_a(n)] \le 3 + 16\sigma^2\log n/\Delta_a^2$$, so $$R_n \le 3\sum_a \Delta_a + \sum_{a : \Delta_a > 0} 16\sigma^2\log n/\Delta_a$$; and $$R_n \le 8\sigma\sqrt{Kn\log n} + 3\sum_a \Delta_a$$.
- [Remark 2.7](course-rl-2026-lecture-2.html#remark-2-7). $$\Delta$$ is not used by UCB; the constant 16 is loose; $$\delta$$ must shrink with $$n$$; instance-dependent and worst-case guarantees.
