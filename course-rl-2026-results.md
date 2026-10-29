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

## Lecture 3: Relative entropy and lower bounds

- [Definition 3.1](course-rl-2026-lecture-3.html#definition-3-1) (Kullback–Leibler divergence). $$\mathrm{KL}(P \,\Vert\, Q) = \mathbb E_P[\log (dP/dQ)]$$ if $$P \ll Q$$, and $$+\infty$$ otherwise.
- [Lemma 3.2](course-rl-2026-lecture-3.html#lemma-3-2) (Gibbs' inequality). $$\mathrm{KL}(P \,\Vert\, Q) \ge 0$$, with equality if and only if $$P = Q$$.
- [Example 3.3](course-rl-2026-lecture-3.html#example-3-3) (Gaussian measures). $$\mathrm{KL}(N(m, \sigma^2) \,\Vert\, N(m', \sigma^2)) = (m - m')^2/(2\sigma^2)$$; a formula for $$N(0, \sigma_P^2)$$ against $$N(0, \sigma_Q^2)$$.
- [Theorem 3.4](course-rl-2026-lecture-3.html#theorem-3-4) (Bretagnolle–Huber). $$P(A) + Q(A^c) \ge \frac12 e^{-\mathrm{KL}(P \,\Vert\, Q)}$$ for every event $$A$$.
- [Lemma 3.5](course-rl-2026-lecture-3.html#lemma-3-5) (likelihood ratio of histories). $$d\mathbb P_\nu/d\mathbb P_{\nu'}(h_n) = \prod_t (d\mu_{a_t}/d\mu'_{a_t})(x_t)$$: the policy does not appear.
- [Lemma 3.6](course-rl-2026-lecture-3.html#lemma-3-6) (divergence decomposition). $$\mathrm{KL}(\mathbb P_\nu \,\Vert\, \mathbb P_{\nu'}) = \sum_a \mathbb E_\nu[N_a(n)]\, \mathrm{KL}(\mu_a \,\Vert\, \mu'_a)$$.
- [Definition 3.7](course-rl-2026-lecture-3.html#definition-3-7) (consistency). $$R_n(\pi, \nu)/n^p \to 0$$ for every $$\nu$$ in the class and every $$p > 0$$.
- [Example 3.8](course-rl-2026-lecture-3.html#example-3-8). Always playing arm 1 is not consistent; $$\mathrm{UCB}(1/n^2)$$ is.
- [Definition 3.9](course-rl-2026-lecture-3.html#definition-3-9) (unstructured classes). $$\mathcal E = \mathcal M^K$$, and $$d_a = \inf\{\mathrm{KL}(\mu_a \,\Vert\, \mu') : \mu' \in \mathcal M,\ \mathrm{mean}(\mu') > m^*\}$$.
- [Theorem 3.10](course-rl-2026-lecture-3.html#theorem-3-10) (Lai–Robbins). For consistent policies over $$\mathcal M^K$$, $$\liminf_n \mathbb E_\nu[N_a(n)]/\log n \ge 1/d_a$$, so $$\liminf_n R_n/\log n \ge \sum_{a : \Delta_a > 0} \Delta_a/d_a$$. Proved in Lecture 4.
- [Corollary 3.11](course-rl-2026-lecture-3.html#corollary-3-11) (Gaussian arms). For $$N(m, \sigma^2)$$ arms, $$d_a = \Delta_a^2/(2\sigma^2)$$, so $$\liminf_n R_n/\log n \ge \sum_{a : \Delta_a > 0} 2\sigma^2/\Delta_a$$.
- [Remark 3.12](course-rl-2026-lecture-3.html#remark-3-12). The heuristic constant $$2\sigma^2/\Delta_a$$ is sharp; the order in KL matters; unstructured classes matter.
