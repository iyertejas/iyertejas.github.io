---
layout: default
title: "Exercise Sheet 1"
description: "Exercise Sheet 1 for Advanced Probabilistic Methods Related to Reinforcement Learning (TU Berlin, Winter 2026/27): regret, sub-Gaussian random variables and the Chernoff bound."
nav: "teaching"
body_class: "course notes"
math: true
---
# Exercise Sheet 1

[Advanced Probabilistic Methods Related to Reinforcement Learning](course-rl-2026.html) · TU Berlin · Winter 2026/27
{: .lede}

Notation as in the [Lecture 1 notes](course-rl-2026-lecture-1.html). Exercises marked <span class="tag">used later</span> are needed in later lectures.

*These notes and exercises were prepared by the lecturer with the help of AI tools, and checked by the lecturer. Please report any errors or unclear points, in the lecture or by email.*
{: .note}

**Exercise 1 (regret of simple policies).** Fix a $$K$$-armed SBM.

(a) Show that the policy that always plays arm $$a$$ has regret $$R_n = n\Delta_a$$.

(b) Show that the policy that plays a uniformly random arm in every round has regret $$R_n = \frac nK \sum_a \Delta_a$$.

(c) Let $$K = 2$$ and $$n$$ be even. Compute the regret of the policy that plays arm 1 in rounds $$1, \dots, n/2$$ and arm 2 in rounds $$n/2 + 1, \dots, n$$.

(d) Do any of these policies have regret that grows more slowly than $$n$$?

**Exercise 2 (scaling and sums).** <span class="tag">used later</span>

(a) Show that if $$X$$ is $$\sigma$$-sub-Gaussian and $$c \in \mathbb R$$, then $$cX$$ is $$\lvert c\rvert\sigma$$-sub-Gaussian.

(b) Show that if $$X_1$$ and $$X_2$$ are independent, $$X_1$$ is $$\sigma_1$$-sub-Gaussian and $$X_2$$ is $$\sigma_2$$-sub-Gaussian, then $$X_1 + X_2$$ is $$\sqrt{\sigma_1^2 + \sigma_2^2}$$-sub-Gaussian.

(c) Show by an example that the conclusion of (b) can fail if $$X_1$$ and $$X_2$$ are not independent.

**Exercise 3 (Hoeffding's lemma).** <span class="tag">used later</span>

(a) Let $$a \le 0 \le b$$ with $$a < b$$. Show that for every $$\lambda \in \mathbb R$$,

$$
\frac{b\, e^{\lambda a} - a\, e^{\lambda b}}{b - a} \le e^{\lambda^2 (b - a)^2 / 8}.
$$

*Hint:* let $$p \in [0, 1]$$ satisfy $$(1 - p)a + pb = 0$$, and put $$h = \lambda(b - a)$$. Take logarithms and use Taylor's theorem to second order in $$h$$.

(b) Hence prove Hoeffding's lemma: if $$X \in [a, b]$$ almost surely, with mean $$m$$, then $$X$$ is $$\frac{b-a}{2}$$-sub-Gaussian.

*Hint:* reduce to $$m = 0$$, and use convexity of $$x \mapsto e^{\lambda x}$$.

**Exercise 4 (the lower tail).** <span class="tag">used later</span> Under the assumptions of Theorem 1.10:

(a) Show that $$\mathbb P(\hat m_s - m \le -\varepsilon) \le \exp\big(-\frac{s\varepsilon^2}{2\sigma^2}\big)$$ for every $$\varepsilon \ge 0$$.

(b) Deduce that $$\mathbb P(\lvert\hat m_s - m\rvert \ge \varepsilon) \le 2 \exp\big(-\frac{s\varepsilon^2}{2\sigma^2}\big)$$.

**Exercise 5 (the Chernoff exponent is sharp for Gaussians).** Let $$X_1, \dots, X_s$$ be independent $$N(m, \sigma^2)$$ random variables and $$\hat m_s = \frac1s \sum_i X_i$$. Show that for every $$\varepsilon > 0$$,

$$
\lim_{s \to \infty} \frac1s \log \mathbb P(\hat m_s - m \ge \varepsilon) = -\frac{\varepsilon^2}{2\sigma^2}.
$$

*Hint:* $$\hat m_s - m \sim N(0, \sigma^2/s)$$. For a standard normal $$Z$$ with density $$\varphi$$, use that $$\frac{z}{1 + z^2}\, \varphi(z) \le \mathbb P(Z > z) \le \frac{\varphi(z)}{z}$$ for $$z > 0$$.

**Exercise 6 (how many samples?).**

(a) Under the assumptions of Theorem 1.10, show that with probability at least $$1 - \delta$$,

$$
\lvert\hat m_s - m\rvert < \sqrt{\frac{2\sigma^2 \log(2/\delta)}{s}}.
$$

(b) Rewards take values in $$[0, 1]$$. How many independent samples are enough to guarantee that the empirical mean is within 0.05 of the true mean with probability at least 0.95?

(c) There are $$K$$ arms, and each is sampled $$s$$ times, independently. Show that the probability that at least one empirical mean is at distance $$\varepsilon$$ or more from its true mean is at most $$2K \exp\big(-\frac{s\varepsilon^2}{2\sigma^2}\big)$$. How must $$s$$ grow with $$K$$ to keep this probability below a fixed $$\delta$$?

**Exercise 7 (Find the flaw).** The following proof of Lemma 1.6 was written by a (by now probably defunct) AI model. Its conclusion is correct; its argument is not.

> *Proof.* Group the rewards by arm: $$\sum_t X_t = \sum_a \sum_{t : A_t = a} X_t$$. The rewards obtained from arm $$a$$ are i.i.d. with mean $$m_a$$, and there are $$N_a(n)$$ of them. Since the number of pulls is independent of the reward values, the expected sum of $$N_a(n)$$ i.i.d. variables with mean $$m_a$$ is $$m_a \mathbb E[N_a(n)]$$. Hence $$\mathbb E\big[\sum_t X_t\big] = \sum_a m_a \mathbb E[N_a(n)]$$, and the claim follows from $$n = \sum_a N_a(n)$$.

(a) Which sentence is false for policies that adapt to the data? Give a two-armed example where it fails.

(b) Can the argument be repaired without the false claim? (*Hint:* when is the $$s$$-th reward from arm $$a$$ drawn, compared with the decision to pull arm $$a$$ for the $$s$$-th time?)

**Exercise 8 (potential rewards).** <span class="tag">used later</span> Let $$Y_1, Y_2, \dots$$ be independent random vectors $$Y_t = (Y_{t,1}, \dots, Y_{t,K})$$ with $$Y_{t,a} \sim \mu_a$$, and let $$U_1, U_2, \dots$$ be independent uniform random variables, independent of the $$Y$$'s. Any policy can be run by setting $$A_t = f_t(A_1, X_1, \dots, A_{t-1}, X_{t-1}, U_t)$$ for suitable functions $$f_t$$. Set $$X_t = Y_{t,A_t}$$.

(a) Note that $$A_t$$ is independent of $$Y_t$$, and deduce that $$\mathbb P(X_t \in \cdot \mid H_{t-1}, A_t) = \mu_{A_t}$$.

(b) Use (a) to give a short proof of Lemma 1.6.

(c) Is $$A_t$$ independent of $$Y_{t-1}$$? Of $$X_{t-1}$$? Give a policy for which it is not.
