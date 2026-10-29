---
layout: default
title: "Lecture 3: Relative entropy and lower bounds"
description: "Notes for Lecture 3 of Advanced Probabilistic Methods Related to Reinforcement Learning (TU Berlin, Winter 2026/27): relative entropy, the Bretagnolle–Huber inequality, likelihoods of bandit histories and the statement of the Lai–Robbins lower bound."
nav: "teaching"
body_class: "course notes"
math: true
sims: true
---
# Lecture 3: Relative entropy and lower bounds

[Advanced Probabilistic Methods Related to Reinforcement Learning](course-rl-2026.html) · TU Berlin · Winter 2026/27 · Lecture of 27 October 2026
{: .lede}

These notes cover the third lecture. The proof of the Lai–Robbins theorem ([Theorem 3.10](#theorem-3-10)) is given at the start of Lecture 4.

Please report any errors or unclear points, in the lecture or by email.
{: .note}

## 1. Relative entropy

**Recall (Radon–Nikodym).** Let $$P$$ and $$Q$$ be $$\sigma$$-finite measures on a measurable space $$(\Omega, \mathcal F)$$. $$P$$ is *absolutely continuous* with respect to $$Q$$, written $$P \ll Q$$, if $$Q(B) = 0$$ implies $$P(B) = 0$$ for every $$B \in \mathcal F$$. By the Radon–Nikodym theorem, if $$P \ll Q$$ there is a measurable function $$dP/dQ : \Omega \to [0, \infty)$$, the *Radon–Nikodym derivative*, with

$$
P(B) = \int_B \frac{dP}{dQ}(x)\, Q(dx) \quad \text{for every } B \in \mathcal F, \qquad\text{equivalently}\qquad \mathbb E_P[f] = \mathbb E_Q\Big[f\, \frac{dP}{dQ}\Big] \ \text{ for measurable } f \ge 0.
$$

It is unique $$Q$$-almost surely. Note that $$dP/dQ > 0$$ $$P$$-almost surely, since $$P(dP/dQ = 0)$$ is the integral of $$dP/dQ$$ over the set where it vanishes.

**Example.** If $$P$$ and $$Q$$ are probability measures on $$\mathbb R$$ with densities $$f_P$$ and $$f_Q$$, and $$P \ll Q$$, then $$\frac{dP}{dQ}(x) = f_P(x)/f_Q(x)$$ wherever $$f_Q(x) > 0$$. For instance, for the Gaussian measures $$P = N(0, \sigma_P^2)$$ and $$Q = N(0, \sigma_Q^2)$$,

$$
\frac{dP}{dQ}(x) = \frac{\frac{1}{\sqrt{2\pi}\,\sigma_P} e^{-x^2/(2\sigma_P^2)}}{\frac{1}{\sqrt{2\pi}\,\sigma_Q} e^{-x^2/(2\sigma_Q^2)}} = \frac{\sigma_Q}{\sigma_P} \exp\Big(-\Big(\frac{1}{2\sigma_P^2} - \frac{1}{2\sigma_Q^2}\Big) x^2\Big),
$$

and for $$P = N(m, \sigma^2)$$ and $$Q = N(m', \sigma^2)$$,

$$
\frac{dP}{dQ}(x) = \exp\Big(\frac{(x - m')^2 - (x - m)^2}{2\sigma^2}\Big).
$$

**Definition 3.1 (Kullback–Leibler divergence, or relative entropy).** For probability measures $$P$$ and $$Q$$ on a common space $$(\Omega, \mathcal F)$$,
{: #definition-3-1}

$$
\mathrm{KL}(P \,\Vert\, Q) = \mathbb E_P\Big[\log \frac{dP}{dQ}\Big] = \mathbb E_Q\Big[\frac{dP}{dQ} \log \frac{dP}{dQ}\Big] \quad \text{if } P \ll Q, \qquad \mathrm{KL}(P \,\Vert\, Q) = +\infty \text{ otherwise}.
$$

It is the expected log-likelihood ratio when the data come from $$P$$: how much evidence for $$P$$ over $$Q$$ one sample from $$P$$ gives, on average. The expectation is well defined: with $$L = dP/dQ$$, the bound $$x \log x \ge -1/e$$ gives $$\mathbb E_Q[(L \log L)^-] \le 1/e$$. The two expressions agree by the identity above, since $$L > 0$$ $$P$$-almost surely.

**Lemma 3.2 (Gibbs' inequality).** For probability measures $$P$$ and $$Q$$, $$\mathrm{KL}(P \,\Vert\, Q) \ge 0$$, with equality if and only if $$P = Q$$.
{: #lemma-3-2}

*Proof.* If $$P$$ is not absolutely continuous with respect to $$Q$$, then $$\mathrm{KL}(P \,\Vert\, Q) = \infty$$ and $$P \ne Q$$. Otherwise let $$L = dP/dQ$$, so that $$\mathbb E_Q[L] = P(\Omega) = 1$$. By Jensen's inequality for the convex function $$\varphi(x) = x \log x$$,

$$
\mathrm{KL}(P \,\Vert\, Q) = \mathbb E_Q[\varphi(L)] \ge \varphi\big(\mathbb E_Q[L]\big) = \varphi(1) = 0.
$$

Since $$\varphi$$ is strictly convex, equality forces $$L$$ to be $$Q$$-almost surely constant, so $$L = 1$$ $$Q$$-almost surely and $$P = Q$$. Conversely, $$P = Q$$ gives $$L = 1$$ and $$\mathrm{KL}(P \,\Vert\, Q) = 0$$. $$\square$$

KL is not a metric: it is not symmetric, and it can be infinite.

**Example 3.3 (Gaussian measures).** Taking $$\mathbb E_P$$ of the logarithm of the two derivatives above:
{: #example-3-3}

(a) with $$\mathbb E_P[X^2] = \sigma_P^2$$ for $$X \sim N(0, \sigma_P^2)$$,

$$
\mathrm{KL}\big(N(0, \sigma_P^2) \,\Vert\, N(0, \sigma_Q^2)\big) = \log\frac{\sigma_Q}{\sigma_P} + \frac{\sigma_P^2}{2\sigma_Q^2} - \frac12;
$$

(b) with $$\mathbb E[(X - m')^2 - (X - m)^2] = (m - m')^2$$ for $$X \sim N(m, \sigma^2)$$,

$$
\mathrm{KL}\big(N(m, \sigma^2) \,\Vert\, N(m', \sigma^2)\big) = \frac{(m - m')^2}{2\sigma^2}.
$$

In (a), the divergence blows up as $$\sigma_P \to 0$$: a very concentrated $$P$$ is easy to tell apart from $$Q$$. In (b), it is half the squared distance between the means, measured in standard deviations. Case (b) is the one we need for Gaussian bandits.

**Try it: relative entropy as a rate.** One sample from $$P$$ gives, on average, $$\mathrm{KL}(P \,\Vert\, Q)$$ units of evidence against $$Q$$. So telling $$P$$ from $$Q$$ with error probability at most $$\delta$$ takes about $$\log(1/\delta)/\mathrm{KL}(P \,\Vert\, Q)$$ samples.

{% include sim-evidence-walk.html %}

A coin is flipped and each flip $$x$$ is scored by $$\log (dP/dQ)(x)$$, where $$(dP/dQ)(x)$$ is the probability of $$x$$ under coin $$P$$ divided by its probability under coin $$Q$$. The table shows that the average score of a flip of coin $$P$$ is exactly $$\mathrm{KL}(P \,\Vert\, Q)$$. So the total score $$\Lambda_N = \sum_{i=1}^N \log (dP/dQ)(X_i)$$ of the first $$N$$ flips $$X_1, \dots, X_N$$ grows like $$N\, \mathrm{KL}(P \,\Vert\, Q)$$, by the law of large numbers, and reaches $$\log(1/\delta)$$ after about $$\log(1/\delta)/\mathrm{KL}(P \,\Vert\, Q)$$ flips. Flipping coin $$Q$$ instead, the total falls at rate $$\mathrm{KL}(Q \,\Vert\, P)$$, which is usually a different number. The test that stops at $$\pm\log(1/\delta)$$ names the wrong coin with probability at most $$\delta$$: under $$Q$$, $$e^{\Lambda_N}$$ is a nonnegative martingale with mean 1, so it reaches $$1/\delta$$ with probability at most $$\delta$$.
{: .caption}

## 2. The Bretagnolle–Huber inequality

A lower bound needs the following: if two laws are close in KL, then no event can be likely under one and unlikely under the other.

**Theorem 3.4 (Bretagnolle–Huber, 1978).** For probability measures $$P$$ and $$Q$$ on a common space $$(\Omega, \mathcal F)$$ and every $$A \in \mathcal F$$,
{: #theorem-3-4}

$$
P(A) + Q(A^c) \ge \frac12 \exp\big(-\mathrm{KL}(P \,\Vert\, Q)\big).
$$

*Proof.* If $$\mathrm{KL}(P \,\Vert\, Q) = \infty$$ there is nothing to prove, so assume it is finite. Then $$P \ll Q$$; let $$L = dP/dQ$$. First,

$$
P(A) + Q(A^c) = \mathbb E_Q[L\, \mathbf 1_A] + \mathbb E_Q[\mathbf 1_{A^c}] \ge \mathbb E_Q[L \wedge 1].
$$

Next, $$L \vee 1 \le L + 1$$ and $$\mathbb E_Q[L] = 1$$, so $$\mathbb E_Q[L \vee 1] \le 2$$. Since $$(L \wedge 1)(L \vee 1) = L$$, the Cauchy–Schwarz inequality gives

$$
\big(\mathbb E_Q[\sqrt L\,]\big)^2 = \Big(\mathbb E_Q\big[\sqrt{L \wedge 1}\, \sqrt{L \vee 1}\,\big]\Big)^2 \le \mathbb E_Q[L \wedge 1]\; \mathbb E_Q[L \vee 1] \le 2\, \mathbb E_Q[L \wedge 1].
$$

Finally, since $$L > 0$$ $$P$$-almost surely, Jensen's inequality for the convex function $$\exp$$ gives

$$
\mathbb E_Q[\sqrt L\,] = \mathbb E_Q\big[L \cdot L^{-1/2}\, \mathbf 1_{\{L > 0\}}\big] = \mathbb E_P\big[e^{-\frac12 \log L}\big] \ge e^{-\frac12 \mathbb E_P[\log L]} = e^{-\frac12 \mathrm{KL}(P \,\Vert\, Q)}.
$$

Combining the three displays, $$P(A) + Q(A^c) \ge \mathbb E_Q[L \wedge 1] \ge \frac12 \big(\mathbb E_Q[\sqrt L\,]\big)^2 \ge \frac12 e^{-\mathrm{KL}(P \,\Vert\, Q)}$$. $$\square$$

**Reading it.** Think of $$A$$ as the event "decide for $$Q$$", so that $$P(A)$$ and $$Q(A^c)$$ are the two errors of a test of $$P$$ against $$Q$$. If both are at most $$\delta$$, then $$\mathrm{KL}(P \,\Vert\, Q) \ge \log(1/(4\delta))$$. So making both errors of order $$1/n$$ needs information of order $$\log n$$; the simulation above shows that a simple test gets by with about that much. Nothing here requires independent data or a fixed sample size: $$A$$ can be any event about the history of a bandit run.

## 3. Likelihoods of bandit histories

Fix a policy $$\pi$$, a horizon $$n$$ and two $$K$$-armed SBMs, with environments $$\nu = (\mu_a)_{a \in [K]}$$ and $$\nu' = (\mu'_a)_{a \in [K]}$$, such that $$\mu_a \ll \mu'_a$$ for every arm $$a$$. Write $$\mathbb P_\nu$$ and $$\mathbb P_{\nu'}$$ for the laws of the history $$H_n \in ([K] \times \mathbb R)^n$$ when $$\pi$$ is run in $$\nu$$ and in $$\nu'$$, and $$\mathbb E_\nu$$, $$\mathbb E_{\nu'}$$ for the expectations.

**Lemma 3.5 (likelihood ratio of histories).** $$\mathbb P_\nu \ll \mathbb P_{\nu'}$$, and
{: #lemma-3-5}

$$
\frac{d\mathbb P_\nu}{d\mathbb P_{\nu'}}(h_n) = \prod_{t=1}^n \frac{d\mu_{a_t}}{d\mu'_{a_t}}(x_t), \qquad h_n = (a_1, x_1, \dots, a_n, x_n).
$$

*Proof.* Let $$C \subseteq ([K] \times \mathbb R)^n$$ be measurable. By the definition of the law of $$H_n$$ through the policy kernels ([Lecture 1](course-rl-2026-lecture-1.html)), $$\mathbb P_\nu(H_n \in C)$$ is a sum over arm sequences of iterated integrals, with $$x_n$$ innermost. In each integral, substitute $$\mu_a(dx) = (d\mu_a/d\mu'_a)(x)\, \mu'_a(dx)$$:

$$
\begin{aligned}
\mathbb P_\nu(H_n \in C) &= \sum_{a_1, \dots, a_n} \int \!\cdots\! \int \mathbf 1_C(h_n) \prod_{t=1}^n \pi_t(a_t, h_{t-1})\, \mu_{a_t}(dx_t) \\
&= \sum_{a_1, \dots, a_n} \int \!\cdots\! \int \mathbf 1_C(h_n) \prod_{t=1}^n \pi_t(a_t, h_{t-1})\, \frac{d\mu_{a_t}}{d\mu'_{a_t}}(x_t)\, \mu'_{a_t}(dx_t) \\
&= \mathbb E_{\nu'}\Big[\mathbf 1_C(H_n) \prod_{t=1}^n \frac{d\mu_{A_t}}{d\mu'_{A_t}}(X_t)\Big].
\end{aligned}
$$

The last step is the same formula for $$\nu'$$, applied to the nonnegative function $$h_n \mapsto \mathbf 1_C(h_n) \prod_t (d\mu_{a_t}/d\mu'_{a_t})(x_t)$$. Since this holds for every measurable $$C$$, the claim follows. $$\square$$

The policy factors $$\pi_t(a_t, h_{t-1})$$ are the same in both environments and do not appear in the likelihood ratio. However adaptive the policy is, only the rewards carry information about which environment we are in.

**Lemma 3.6 (divergence decomposition).** Under the same assumptions, with the convention $$0 \cdot \infty = 0$$,
{: #lemma-3-6}

$$
\mathrm{KL}\big(\mathbb P_\nu \,\Vert\, \mathbb P_{\nu'}\big) = \sum_{a=1}^K \mathbb E_\nu[N_a(n)]\, \mathrm{KL}(\mu_a \,\Vert\, \mu'_a).
$$

*Proof.* Write $$g_a = d\mu_a/d\mu'_a$$ and $$L_t = \log g_{A_t}(X_t)$$. By [Lemma 3.5](#lemma-3-5) and [Definition 3.1](#definition-3-1),

$$
\mathrm{KL}\big(\mathbb P_\nu \,\Vert\, \mathbb P_{\nu'}\big) = \mathbb E_\nu\Big[\log \prod_{t=1}^n g_{A_t}(X_t)\Big] = \mathbb E_\nu\Big[\sum_{t=1}^n L_t\Big].
$$

Given $$H_{t-1}$$ and $$A_t$$, the reward $$X_t$$ has law $$\mu_{A_t}$$; this is where the SBM assumption is used. Hence

$$
\mathbb E_\nu[L_t \mid H_{t-1}, A_t] = \int \log g_{A_t}\, d\mu_{A_t} = \mathrm{KL}(\mu_{A_t} \,\Vert\, \mu'_{A_t}) = \sum_{a=1}^K \mathrm{KL}(\mu_a \,\Vert\, \mu'_a)\, \mathbf 1_{\{A_t = a\}}.
$$

Each $$L_t$$ has integrable negative part, $$\mathbb E_\nu[L_t^-] \le 1/e$$ as after [Definition 3.1](#definition-3-1), so all these expectations are well defined in $$(-\infty, \infty]$$ and we may take expectations and sum over $$t$$:

$$
\mathbb E_\nu\Big[\sum_{t=1}^n L_t\Big] = \sum_{a=1}^K \mathrm{KL}(\mu_a \,\Vert\, \mu'_a)\, \mathbb E_\nu\Big[\sum_{t=1}^n \mathbf 1_{\{A_t = a\}}\Big] = \sum_{a=1}^K \mathbb E_\nu[N_a(n)]\, \mathrm{KL}(\mu_a \,\Vert\, \mu'_a). \qquad \square
$$

Compare the regret decomposition ([Lemma 1.6](course-rl-2026-lecture-1.html#lemma-1-6)): the same argument, with $$\Delta_a$$ replaced by $$\mathrm{KL}(\mu_a \,\Vert\, \mu'_a)$$. Evidence about $$\nu$$ against $$\nu'$$ accumulates only on pulls of arms where the two environments differ, at rate $$\mathrm{KL}(\mu_a \,\Vert\, \mu'_a)$$ per pull. In particular, if $$\nu'$$ changes a single arm $$a$$, then $$\mathrm{KL}(\mathbb P_\nu \,\Vert\, \mathbb P_{\nu'}) = \mathbb E_\nu[N_a(n)]\, \mathrm{KL}(\mu_a \,\Vert\, \mu'_a)$$: a policy that rarely pulls arm $$a$$ cannot notice the change.

## 4. Consistency and the Lai–Robbins theorem

For a fixed environment $$\nu$$, can we hope for a lower bound of the form "every policy has $$R_n \ge c \log n$$"? No: the policy that always plays an optimal arm of $$\nu$$ has zero regret in $$\nu$$. A lower bound for a single environment must exclude policies that are good there only by luck. We do this by asking the policy to be reasonable on a whole class of environments.

**Definition 3.7 (consistency).** Let $$\mathcal E$$ be a class of $$K$$-armed SBM environments. A policy $$\pi$$ is *consistent* over $$\mathcal E$$ if for every $$\nu \in \mathcal E$$ and every $$p > 0$$,
{: #definition-3-7}

$$
\lim_{n \to \infty} \frac{R_n(\pi, \nu)}{n^p} = 0.
$$

A policy may depend on the horizon, as $$\mathrm{UCB}(1/n^2)$$ does; formally it is then a sequence of policies, one for each $$n$$.

**Example 3.8.** Let $$\mathcal E$$ be the class of $$K$$-armed SBMs with $$\sigma$$-sub-Gaussian rewards, for a fixed $$\sigma$$. Always playing arm 1 is not consistent over $$\mathcal E$$: in an environment where arm 1 is suboptimal, its regret is $$n\Delta_1$$. $$\mathrm{UCB}(1/n^2)$$ is consistent over $$\mathcal E$$, since its regret is $$O(\log n)$$ by [Theorem 2.6](course-rl-2026-lecture-2.html#theorem-2-6).
{: #example-3-8}

**Definition 3.9 (unstructured classes).** A class $$\mathcal E$$ of $$K$$-armed SBM environments is *unstructured* if $$\mathcal E = \mathcal M^K = \{(\mu_1, \dots, \mu_K) : \mu_b \in \mathcal M \text{ for every } b \in [K]\}$$ for some class $$\mathcal M$$ of probability measures on $$\mathbb R$$ with finite means. For $$\nu = (\mu_1, \dots, \mu_K) \in \mathcal E$$ with largest mean $$m^*$$ and an arm $$a \in [K]$$, define
{: #definition-3-9}

$$
d_a = d_a(\nu, \mathcal M) = \inf\big\{ \mathrm{KL}(\mu_a \,\Vert\, \mu') : \mu' \in \mathcal M,\ \mathrm{mean}(\mu') > m^* \big\} \in [0, \infty], \qquad \inf \emptyset = \infty.
$$

In words, $$d_a$$ is the least information per pull of arm $$a$$ that separates its true distribution $$\mu_a$$ from a distribution in $$\mathcal M$$ under which arm $$a$$ would be the best arm. In an unstructured class, changing one arm of an environment to another distribution in $$\mathcal M$$ gives another environment in the class.

**Theorem 3.10 (Lai–Robbins, 1985).** Let $$\mathcal E = \mathcal M^K$$ be an unstructured class and $$\pi$$ a policy that is consistent over $$\mathcal E$$. Then for every $$\nu \in \mathcal E$$ and every arm $$a$$ with $$\Delta_a > 0$$,
{: #theorem-3-10}

$$
\liminf_{n\to\infty} \frac{\mathbb E_\nu[N_a(n)]}{\log n} \ge \frac{1}{d_a}, \qquad\text{hence}\qquad \liminf_{n\to\infty} \frac{R_n(\pi,\nu)}{\log n} \ge \sum_{a:\,\Delta_a>0} \frac{\Delta_a}{d_a},
$$

with the conventions $$1/\infty = 0$$ and $$1/0 = \infty$$.

The proof is at the start of Lecture 4.

Lai and Robbins proved [Theorem 3.10](#theorem-3-10) for parametric families; the form above, for general unstructured classes, is due to Burnetas and Katehakis (1996).

**Corollary 3.11 (Gaussian arms).** Fix $$\sigma > 0$$. If $$\mathcal M = \{N(m, \sigma^2) : m \in \mathbb R\}$$, then $$d_a = \Delta_a^2/(2\sigma^2)$$. Hence every consistent policy satisfies
{: #corollary-3-11}

$$
\liminf_{n\to\infty} \frac{\mathbb E_\nu[N_a(n)]}{\log n} \ge \frac{2\sigma^2}{\Delta_a^2} \quad\text{for every arm } a \text{ with } \Delta_a > 0, \qquad \liminf_{n\to\infty} \frac{R_n(\pi,\nu)}{\log n} \ge \sum_{a:\,\Delta_a>0} \frac{2\sigma^2}{\Delta_a}.
$$

*Proof, given [Theorem 3.10](#theorem-3-10).* By [Example 3.3(b)](#example-3-3), $$\mathrm{KL}\big(N(m_a, \sigma^2) \,\Vert\, N(m', \sigma^2)\big) = (m' - m_a)^2/(2\sigma^2)$$. Its infimum over $$m' > m^*$$ is $$(m^* - m_a)^2/(2\sigma^2) = \Delta_a^2/(2\sigma^2)$$, approached as $$m' \downarrow m^*$$ but not attained. $$\square$$

**Remark 3.12.**
{: #remark-3-12}

1. **The constant is sharp.** [UCB](course-rl-2026-lecture-2.html#algorithm-2-5) with a more careful confidence level attains $$\limsup_n R_n/\log n \le \sum_{a : \Delta_a > 0} 2\sigma^2/\Delta_a$$ for Gaussian rewards ([Remark 2.7](course-rl-2026-lecture-2.html#remark-2-7)(2)). So, by [Corollary 3.11](#corollary-3-11), $$2\sigma^2/\Delta_a$$ is exactly the right constant, and the 16 in [Theorem 2.6](course-rl-2026-lecture-2.html#theorem-2-6) is the price of our choices in its proof.
2. **The order in KL matters.** The true distribution $$\mu_a$$ comes first in $$d_a$$. For Bernoulli arms one can show that $$d_a = \mathrm{kl}(m_a, m^*)$$, where $$\mathrm{kl}(x, y) = \mathrm{KL}(\mathrm{Ber}(x) \,\Vert\, \mathrm{Ber}(y))$$, and this differs from $$\mathrm{kl}(m^*, m_a)$$ in general.
3. **Unstructured classes matter.** If the arms are coupled, the class is not unstructured, and [Theorem 3.10](#theorem-3-10) need not apply. Conversely, if $$\mathcal M$$ is too rich, $$d_a$$ can be 0, and then no consistent policy has logarithmic regret.

## 5. Next lecture

Lecture 4 starts with a short recap and the proof of [Theorem 3.10](#theorem-3-10). The same two tools, the divergence decomposition ([Lemma 3.6](#lemma-3-6)) and Bretagnolle–Huber ([Theorem 3.4](#theorem-3-4)), then give a lower bound at the other scale. For a fixed horizon $$n$$, gaps of order $$\sigma\sqrt{K/n}$$ force regret of order $$\sigma\sqrt{Kn}$$ on every policy.

## Reading

T. Lattimore and C. Szepesvári, *Bandit Algorithms*, Cambridge University Press, 2020, freely available [online](https://tor-lattimore.com/downloads/book/book.pdf): Chapter 14 (relative entropy; [Theorem 3.4](#theorem-3-4) is their Theorem 14.2), Chapter 15 ([Lemma 3.6](#lemma-3-6) is their Lemma 15.1) and Chapter 16 ([Theorem 3.10](#theorem-3-10)). T. M. Cover and J. A. Thomas, *Elements of Information Theory*, Chapter 2, for relative entropy.

<nav class="notes-nav" aria-label="Course notes"><a href="course-rl-2026-lecture-2.html">← Lecture 2</a><a href="course-rl-2026-results.html">Results so far</a><a href="course-rl-2026.html">Course page</a></nav>
