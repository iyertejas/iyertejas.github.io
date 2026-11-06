---
layout: default
title: "Lecture 4: Lower bounds at two scales"
description: "Notes for Lecture 4 of Advanced Probabilistic Methods Related to Reinforcement Learning (TU Berlin, Winter 2026/27): the Lai–Robbins lower bound with its proof, the minimax lower bound of order √(Kn), and worst-case regret from pull counts."
nav: "teaching"
body_class: "course notes"
math: true
sims: true
---
# Lecture 4: Lower bounds at two scales

[Advanced Probabilistic Methods Related to Reinforcement Learning](course-rl-2026.html) · TU Berlin · Winter 2026/27 · Lecture of 3 November 2026
{: .lede}

These notes cover the fourth lecture. [Section 1](#1-the-lairobbins-theorem) states and proves the Lai–Robbins theorem: in a fixed environment, every consistent policy must pull each suboptimal arm at least about $$\log n/d_a$$ times. [Section 2](#2-the-minimax-lower-bound) runs the same argument at the other scale. The horizon is fixed, and the environments are chosen so close that no policy can tell them apart, which forces regret of order $$\sqrt{Kn}$$. [Section 3](#3-from-pull-counts-to-worst-case-bounds) shows that [UCB](course-rl-2026-lecture-2.html#algorithm-2-5) attains this order up to a factor $$\sqrt{\log n}$$.

Please report any errors or unclear points, in the lecture or by email.
{: .note}

## 1. The Lai–Robbins theorem

Recall from Lecture 3 that for an unstructured class $$\mathcal M^K$$ ([Definition 3.9](course-rl-2026-lecture-3.html#definition-3-9)), an environment $$\nu = (\mu_1, \dots, \mu_K) \in \mathcal M^K$$ with largest mean $$m^*$$, and an arm $$a$$,

$$
d_a = d_a(\nu, \mathcal M) = \inf\big\{ \mathrm{KL}(\mu_a \,\Vert\, \mu') : \mu' \in \mathcal M,\ \mathrm{mean}(\mu') > m^* \big\} \in [0, \infty], \qquad \inf\emptyset = \infty,
$$

the least information per pull of arm $$a$$ that separates $$\mu_a$$ from a distribution in $$\mathcal M$$ under which arm $$a$$ would be the best arm.

**Theorem 4.1 (Lai–Robbins, 1985).** Let $$\mathcal M^K$$ be an unstructured class and $$\pi$$ a policy that is consistent ([Definition 3.7](course-rl-2026-lecture-3.html#definition-3-7)) over $$\mathcal M^K$$. Then for every $$\nu \in \mathcal M^K$$ and every arm $$a$$ with $$\Delta_a > 0$$,
{: #theorem-4-1}

$$
\liminf_{n\to\infty} \frac{\mathbb E_\nu[N_a(n)]}{\log n} \ge \frac{1}{d_a}, \qquad\text{hence}\qquad \liminf_{n\to\infty} \frac{R_n(\pi,\nu)}{\log n} \ge \sum_{a:\,\Delta_a>0} \frac{\Delta_a}{d_a},
$$

with the conventions $$1/\infty = 0$$ and $$1/0 = \infty$$.

This is [Theorem 3.10](course-rl-2026-lecture-3.html#theorem-3-10), stated in Lecture 3.

*Proof.* The bound on the regret follows from the bound on $$\mathbb E_\nu[N_a(n)]$$ by [Lemma 1.6](course-rl-2026-lecture-1.html#lemma-1-6). Fix $$\nu \in \mathcal M^K$$ and an arm $$a$$ with $$\Delta_a > 0$$. If $$d_a = \infty$$ there is nothing to prove. Otherwise fix $$\varepsilon > 0$$ and choose $$\mu_a' \in \mathcal M$$ with $$\mathrm{mean}(\mu_a') > m^*$$ and $$\mathrm{KL}(\mu_a \,\Vert\, \mu_a') < d_a + \varepsilon$$.

Let $$\nu'$$ be the environment obtained from $$\nu$$ by replacing $$\mu_a$$ by $$\mu_a'$$. Then $$\nu' \in \mathcal M^K$$, since the class is unstructured: this is where that assumption is used. Both environments are run with the same policy $$\pi$$. They differ only in arm $$a$$, and $$\mu_a \ll \mu_a'$$ since $$\mathrm{KL}(\mu_a \,\Vert\, \mu_a') < \infty$$, so by [Lemma 3.6](course-rl-2026-lecture-3.html#lemma-3-6)

$$
\mathrm{KL}(\mathbb P_\nu \,\Vert\, \mathbb P_{\nu'}) = \mathbb E_\nu[N_a(n)]\, \mathrm{KL}(\mu_a \,\Vert\, \mu_a') \le \mathbb E_\nu[N_a(n)]\,(d_a + \varepsilon).
$$

By [Theorem 3.4](course-rl-2026-lecture-3.html#theorem-3-4), applied to the event $$\{N_a(n) \ge n/2\}$$, which is determined by $$H_n$$,

$$
\mathbb P_\nu\big(N_a(n) \ge \tfrac n2\big) + \mathbb P_{\nu'}\big(N_a(n) < \tfrac n2\big) \ge \tfrac12 \exp\big(-\mathbb E_\nu[N_a(n)]\,(d_a + \varepsilon)\big).
$$

Now set $$\gamma = \min\{\Delta_a,\ \mathrm{mean}(\mu_a') - m^*\} > 0$$. In $$\nu$$, arm $$a$$ has gap $$\Delta_a \ge \gamma$$, so by [Lemma 1.6](course-rl-2026-lecture-1.html#lemma-1-6), $$R_n(\pi,\nu) \ge \gamma \frac n2\, \mathbb P_\nu(N_a(n) \ge \frac n2)$$. In $$\nu'$$, arm $$a$$ is the unique optimal arm, and every other arm $$b$$ has gap $$\mathrm{mean}(\mu_a') - m_b \ge \mathrm{mean}(\mu_a') - m^* \ge \gamma$$. On $$\{N_a(n) < n/2\}$$ these arms are pulled more than $$n/2$$ times, so $$R_n(\pi,\nu') \ge \gamma \frac n2\, \mathbb P_{\nu'}(N_a(n) < \frac n2)$$. Hence

$$
R_n(\pi,\nu) + R_n(\pi,\nu') \ge \frac{\gamma n}{4} \exp\big(-\mathbb E_\nu[N_a(n)]\,(d_a + \varepsilon)\big).
$$

On the other hand, fix $$p \in (0,1)$$. Since $$\pi$$ is consistent over $$\mathcal M^K$$, applied in $$\nu$$ and in $$\nu'$$, we have $$R_n(\pi,\nu) + R_n(\pi,\nu') \le n^p$$ for all sufficiently large $$n$$. This is where consistency is used, and in particular consistency in $$\nu'$$. So, for all large $$n$$,

$$
\frac{4n^{p-1}}{\gamma} \ge \exp\big(-\mathbb E_\nu[N_a(n)]\,(d_a + \varepsilon)\big), \qquad\text{that is,}\qquad \mathbb E_\nu[N_a(n)]\,(d_a + \varepsilon) \ge (1-p)\log n - \log\frac4\gamma.
$$

Dividing by $$(d_a + \varepsilon)\log n$$ gives $$\liminf_n \mathbb E_\nu[N_a(n)]/\log n \ge (1-p)/(d_a+\varepsilon)$$. Let $$p \downarrow 0$$ and $$\varepsilon \downarrow 0$$; if $$d_a = 0$$, the right-hand side tends to $$\infty$$. $$\square$$

## 2. The minimax lower bound

In [Section 1](#1-the-lairobbins-theorem) we fixed an environment $$\nu$$ and asked how small the regret of a policy can be, asymptotically in $$n$$. Now we fix $$n$$ and ask for the worst regret over all environments, so the gaps $$\Delta_a$$ may depend on $$n$$. Each environment is still an ordinary SBM, fixed for the whole run ([Remark 2.7](course-rl-2026-lecture-2.html#remark-2-7)(4)).

**Definition 4.2 (minimax regret).** For a class $$\mathcal M^K$$ of $$K$$-armed SBM environments and a horizon $$n$$, the *minimax regret* is
{: #definition-4-2}

$$
R_n^*(\mathcal M^K) = \inf_\pi \sup_{\nu \in \mathcal M^K} R_n(\pi, \nu).
$$

The supremum is taken after $$n$$ and $$\pi$$ are fixed, so the worst environment may depend on both. A larger class can only make $$R_n^*$$ larger.

**Definition 4.3 (cost of raising a mean).** For a class $$\mathcal M$$ of probability measures on $$\mathbb R$$ with finite means and $$\eta > 0$$, let
{: #definition-4-3}

$$
d^\eta = d^\eta(\mathcal M) = \inf\big\{\mathrm{KL}(\mu \,\Vert\, \mu') : \mu, \mu' \in \mathcal M,\ \mathrm{mean}(\mu') > \mathrm{mean}(\mu) + \eta\big\} \in [0, \infty], \qquad \inf\emptyset = \infty.
$$

So $$d^\eta$$ is the least information per sample that separates two distributions in $$\mathcal M$$ whose means differ by more than $$\eta$$. It depends only on the class, and it is nondecreasing in $$\eta$$. For $$\nu \in \mathcal M^K$$, the constant $$d_a$$ of [Section 1](#1-the-lairobbins-theorem) is the same infimum with $$\mu = \mu_a$$ fixed, since $$\mathrm{mean}(\mu') > m^*$$ means $$\mathrm{mean}(\mu') > \mathrm{mean}(\mu_a) + \Delta_a$$; in particular $$d_a \ge d^{\Delta_a}$$. For example, for $$\mathcal M = \{N(m, \sigma^2) : m \in \mathbb R\}$$, [Example 3.3(b)](course-rl-2026-lecture-3.html#example-3-3) gives $$d^\eta = \eta^2/(2\sigma^2)$$.

**Theorem 4.4 (minimax lower bound).** Let $$\mathcal M$$ be a class of probability measures on $$\mathbb R$$ with finite means such that $$\{\mathrm{mean}(\mu) : \mu \in \mathcal M\}$$ is an interval, and let $$K \ge 2$$ and $$n \in \mathbb N$$. Then, with the convention $$e^{-\infty} = 0$$,
{: #theorem-4-4}

$$
R_n^*(\mathcal M^K) \ge \sup_{\Delta > 0} \frac{n\Delta}{8} \exp\Big(-\frac{n}{K-1}\, d^{2\Delta}(\mathcal M)\Big).
$$

*Proof.* Fix a policy $$\pi$$ and $$\Delta > 0$$. If $$d^{2\Delta} = \infty$$ there is nothing to prove. Otherwise fix $$\varepsilon > 0$$. By [Definition 4.3](#definition-4-3) there are $$\mu_0, \mu' \in \mathcal M$$ with

$$
\mathrm{mean}(\mu') > \mathrm{mean}(\mu_0) + 2\Delta, \qquad \mathrm{KL}(\mu_0 \,\Vert\, \mu') < d^{2\Delta} + \varepsilon.
$$

Since the means of $$\mathcal M$$ form an interval containing $$\mathrm{mean}(\mu_0)$$ and $$\mathrm{mean}(\mu')$$, there is $$\mu_1 \in \mathcal M$$ with $$\mathrm{mean}(\mu_1) = \mathrm{mean}(\mu_0) + \Delta$$; this is where that assumption is used. Let $$\nu = (\mu_1, \mu_0, \dots, \mu_0) \in \mathcal M^K$$. In $$\nu$$, every arm $$a \ge 2$$ has gap $$\Delta$$, and $$\mathrm{mean}(\mu') > \mathrm{mean}(\mu_1) + \Delta$$. Since $$\sum_{a \ge 2} \mathbb E_\nu[N_a(n)] \le n$$, some arm $$a' \ge 2$$ has

$$
\mathbb E_\nu[N_{a'}(n)] \le \frac{n}{K-1}.
$$

Let $$\nu'$$ be $$\nu$$ with the law of arm $$a'$$ changed to $$\mu'$$; then $$\nu' \in \mathcal M^K$$. Arm $$a'$$ is optimal in $$\nu'$$, and every other arm has gap more than $$\Delta$$ there. Both environments are run with the same policy $$\pi$$, and $$\mu_0 \ll \mu'$$ since $$\mathrm{KL}(\mu_0 \,\Vert\, \mu') < \infty$$, so by [Lemma 3.6](course-rl-2026-lecture-3.html#lemma-3-6) only arm $$a'$$ contributes:

$$
\mathrm{KL}(\mathbb P_\nu \,\Vert\, \mathbb P_{\nu'}) = \mathbb E_\nu[N_{a'}(n)]\, \mathrm{KL}(\mu_0 \,\Vert\, \mu') \le \frac{n}{K-1}\,\big(d^{2\Delta} + \varepsilon\big).
$$

On $$\{N_{a'}(n) > n/2\}$$, arm $$a'$$, which has gap $$\Delta$$ in $$\nu$$, is pulled more than $$n/2$$ times. On $$\{N_{a'}(n) \le n/2\}$$, arms with gap more than $$\Delta$$ in $$\nu'$$ are pulled at least $$n/2$$ times. So by [Lemma 1.6](course-rl-2026-lecture-1.html#lemma-1-6) and [Theorem 3.4](course-rl-2026-lecture-3.html#theorem-3-4),

$$
R_n(\pi,\nu) + R_n(\pi,\nu') \ge \frac{n\Delta}{2}\Big(\mathbb P_\nu\big(N_{a'}(n) > \tfrac n2\big) + \mathbb P_{\nu'}\big(N_{a'}(n) \le \tfrac n2\big)\Big) \ge \frac{n\Delta}{4} \exp\Big(-\frac{n}{K-1}\,\big(d^{2\Delta} + \varepsilon\big)\Big).
$$

The larger of two numbers is at least half their sum, so one of the two regrets is at least $$\frac{n\Delta}{8}\exp\big(-\frac{n}{K-1}(d^{2\Delta}+\varepsilon)\big)$$, and hence so is $$\sup_{\nu'' \in \mathcal M^K} R_n(\pi, \nu'')$$. Let $$\varepsilon \downarrow 0$$ and take the supremum over $$\Delta > 0$$. Since $$\pi$$ was arbitrary, the bound holds for the infimum over $$\pi$$. $$\square$$

*Correction to the lecture.* On the board, the proof ended with the bound $$\frac{n\Delta}{4}\exp\big(-\frac{n}{K-1}d^{2\Delta}\big)$$ on the sum $$R_n(\pi,\nu) + R_n(\pi,\nu')$$. The last step, passing from the sum to the larger of the two regrets, costs a further factor $$\frac12$$, so the constant in [Theorem 4.4](#theorem-4-4) is $$\frac18$$, not $$\frac14$$.
{: .note}

**Corollary 4.5 (quadratic cost).** Suppose that the means of $$\mathcal M$$ form an interval. Let $$C > 0$$ and $$n \in \mathbb N$$, and put $$\Delta = \sqrt{(K-1)/(2Cn)}$$. If $$d^{2\Delta} \le C\Delta^2$$, then
{: #corollary-4-5}

$$
R_n^*(\mathcal M^K) \ge \frac{1}{19} \sqrt{\frac{(K-1)\,n}{C}}.
$$

In particular, this holds for every $$n$$ if $$d^{2\Delta} \le C\Delta^2$$ for every $$\Delta > 0$$.

*Proof.* By the choice of $$\Delta$$, $$\frac{n}{K-1}\, d^{2\Delta} \le \frac{n}{K-1}\, C\Delta^2 = \frac12$$. So [Theorem 4.4](#theorem-4-4) gives

$$
R_n^* \ge \frac{n\Delta}{8}\, e^{-1/2} = \frac{e^{-1/2}}{8\sqrt2}\sqrt{\frac{(K-1)\,n}{C}} \ge \frac{1}{19}\sqrt{\frac{(K-1)\,n}{C}}. \qquad \square
$$

**Remark 4.6 (Gaussian and Bernoulli arms).** The assumption of [Corollary 4.5](#corollary-4-5) holds for Gaussian and for Bernoulli arms.
{: #remark-4-6}

1. **Gaussian arms.** For $$\mathcal M = \{N(m,\sigma^2) : m \in \mathbb R\}$$, $$d^{2\Delta} = 2\Delta^2/\sigma^2$$ for every $$\Delta$$, so $$C = 2/\sigma^2$$ and, for every $$n$$, $$R_n^*(\mathcal M^K) \ge \frac{\sigma}{19\sqrt2}\sqrt{(K-1)\,n} \ge \frac{\sigma}{27}\sqrt{(K-1)\,n}$$. The same bound holds for the class of all $$K$$-armed SBMs with $$\sigma$$-sub-Gaussian rewards, since it contains these Gaussian environments.
2. **Bernoulli arms.** For $$\mathcal M = \{\mathrm{Ber}(x) : x \in [0,1]\}$$, we have $$d^{2\Delta} \le 2\Delta \log\frac{1+2\Delta}{1-2\Delta}$$ for $$\Delta < \frac12$$ by [Exercise 4.1(b)](course-rl-2026-sheet-4.html#exercise-4-1), and $$d^{2\Delta} = \infty$$ for $$\Delta \ge \frac12$$. Since $$\log\frac{1+x}{1-x} \le \frac{2x}{1-x^2} \le \frac{8x}{3}$$ for $$x \in [0, \frac12]$$, this gives $$d^{2\Delta} \le \frac{32}{3}\Delta^2$$ for $$\Delta \le \frac14$$. With $$C = \frac{32}{3}$$, the $$\Delta$$ of [Corollary 4.5](#corollary-4-5) is at most $$\frac14$$ exactly when $$n \ge \frac34(K-1)$$, and then $$R_n^*(\mathcal M^K) \ge \frac{1}{19}\sqrt{3(K-1)n/32} \ge \frac{1}{63}\sqrt{(K-1)\,n}$$. The same bound holds for the class of all SBMs with rewards in $$[0,1]$$.

## 3. From pull counts to worst-case bounds

[Theorem 2.6](course-rl-2026-lecture-2.html#theorem-2-6) bounds the pull counts of [UCB](course-rl-2026-lecture-2.html#algorithm-2-5) in a fixed environment, and that bound blows up as the gaps shrink. But arms with tiny gaps are cheap however often they are pulled, and this turns any such bound into a worst-case bound.

**Lemma 4.7 (from pull counts to worst-case regret).** Let $$\pi$$ be a policy and $$\nu$$ a $$K$$-armed SBM environment. Suppose there are constants $$A \ge 0$$ and $$B > 0$$ such that $$\mathbb E_\nu[N_a(n)] \le A + B/\Delta_a^2$$ for every arm $$a$$ with $$\Delta_a > 0$$. Then
{: #lemma-4-7}

$$
R_n(\pi,\nu) \le 2\sqrt{BKn} + A\sum_{a=1}^K \Delta_a.
$$

*Proof.* Fix a threshold $$\eta > 0$$ and split the arms in the regret decomposition ([Lemma 1.6](course-rl-2026-lecture-1.html#lemma-1-6)):

$$
R_n(\pi,\nu) = \sum_{a=1}^K \Delta_a\, \mathbb E_\nu[N_a(n)]\,\big(\mathbf 1\{\Delta_a \le \eta\} + \mathbf 1\{\Delta_a > \eta\}\big).
$$

The arms with $$\Delta_a \le \eta$$ contribute at most $$\eta \sum_a \mathbb E_\nu[N_a(n)] = \eta n$$. An arm with $$\Delta_a > \eta$$ contributes at most $$(A + B/\Delta_a^2)\Delta_a = A\Delta_a + B/\Delta_a < A\Delta_a + B/\eta$$. Hence

$$
R_n(\pi,\nu) \le \eta n + \frac{KB}{\eta} + A\sum_{a=1}^K \Delta_a,
$$

and $$\eta = \sqrt{KB/n}$$ makes the first two terms equal to $$\sqrt{BKn}$$ each. $$\square$$

**Corollary 4.8 (UCB, worst case).** For $$\sigma$$-sub-Gaussian rewards and $$n \ge K$$, $$\mathrm{UCB}(1/n^2)$$ satisfies, in every environment,
{: #corollary-4-8}

$$
R_n \le 8\sigma\sqrt{Kn\log n} + 3\sum_{a=1}^K \Delta_a.
$$

*Proof.* [Theorem 2.6](course-rl-2026-lecture-2.html#theorem-2-6) gives the assumption of [Lemma 4.7](#lemma-4-7) with $$A = 3$$ and $$B = 16\sigma^2\log n$$, and $$2\sqrt{16\sigma^2 Kn\log n} = 8\sigma\sqrt{Kn\log n}$$. $$\square$$

With [Remark 4.6](#remark-4-6)(1), $$\sqrt{Kn}$$ is the right order of the worst-case regret for $$\sigma$$-sub-Gaussian rewards, up to a factor $$\sqrt{\log n}$$. That factor comes from $$\delta = 1/n^2$$ in the confidence width. A modification of [UCB](course-rl-2026-lecture-2.html#algorithm-2-5) called MOSS removes it and attains order $$\sqrt{Kn}$$ (Lattimore–Szepesvári, Chapter 9), so [Theorem 4.4](#theorem-4-4) is sharp up to constants. [Lemma 4.7](#lemma-4-7) applies to any policy with a pull-count bound of this form, so later policies get a worst-case bound for free.

**The two scales, side by side.**

|  | large-deviation scale ([Section 1](#1-the-lairobbins-theorem)) | central-limit scale ([Section 2](#2-the-minimax-lower-bound)) |
| --- | --- | --- |
| regime | $$\Delta$$ fixed, $$n \to \infty$$ | $$n$$ fixed, $$\Delta \approx \sqrt{K/n}$$ |
| information $$N \cdot \mathrm{KL}$$ | about $$\log n$$ | at most about $$\frac12$$, with $$\Delta$$ as in [Corollary 4.5](#corollary-4-5) |
| what forces it | consistency | the choice of $$\Delta$$ in [Corollary 4.5](#corollary-4-5) |
| bandit consequence | $$\log n/d_a$$ pulls of each suboptimal arm | regret of order $$\sqrt{Kn}$$ |

## 4. Next lecture

The lower bound $$\log n/d_a$$ of [Theorem 4.1](#theorem-4-1) depends on the whole law of each arm, not only on its mean. Lecture 5 constructs a policy that attains it for every environment with rewards in $$[0, 1]$$, by testing with bets.

## Check yourself

Seven true-or-false questions on this lecture. Decide, then click to see the reasoning; nothing is recorded.

{% include quiz-lecture-4.html %}

## Reading

T. Lattimore and C. Szepesvári, *Bandit Algorithms*, Cambridge University Press, 2020, freely available [online](https://tor-lattimore.com/downloads/book/book.pdf): Chapter 15 (the minimax lower bound; [Remark 4.6](#remark-4-6)(1) is their Theorem 15.2), Chapter 16 (Lai–Robbins), Chapter 7 (the worst-case bound for UCB) and Chapter 9 (MOSS). T. L. Lai and H. Robbins, Asymptotically efficient adaptive allocation rules, *Advances in Applied Mathematics* 6 (1985), 4–22. A. N. Burnetas and M. N. Katehakis, Optimal adaptive policies for sequential allocation problems, *Advances in Applied Mathematics* 17 (1996), 122–142, for [Theorem 4.1](#theorem-4-1) in the generality stated here. P. Auer, N. Cesa-Bianchi, Y. Freund and R. E. Schapire, The nonstochastic multiarmed bandit problem, *SIAM Journal on Computing* 32 (2002), 48–77: the first $$\sqrt{Kn}$$ lower bound, for Bernoulli arms.

<nav class="notes-nav" aria-label="Course notes"><a href="course-rl-2026-lecture-3.html">← Lecture 3</a><a href="course-rl-2026-sheet-4.html">Exercise Sheet 4</a><a href="course-rl-2026-results.html">Results so far</a><a href="course-rl-2026.html">Course page</a></nav>
