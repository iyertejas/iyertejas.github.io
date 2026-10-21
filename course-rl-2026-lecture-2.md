---
layout: default
title: "Lecture 2: Explore-then-commit and UCB"
description: "Notes for Lecture 2 of Advanced Probabilistic Methods Related to Reinforcement Learning (TU Berlin, Winter 2026/27): the reward table, explore-then-commit, and the UCB algorithm with its regret bound."
nav: "teaching"
body_class: "course notes"
math: true
sims: true
---
# Lecture 2: Explore-then-commit and UCB

[Advanced Probabilistic Methods Related to Reinforcement Learning](course-rl-2026.html) · TU Berlin · Winter 2026/27 · Lecture of 20 October 2026
{: .lede}

These notes cover the second lecture, with some extra supplementary material based on the class. The exercises are on [Exercise Sheet 2](course-rl-2026-sheet-2.html).

Please report any errors or unclear points, in the lecture or by email.
{: .note}

## 1. How much regret to expect

Recall from [Lecture 1](course-rl-2026-lecture-1.html) the $$K$$-armed SBM ([Definition 1.1](course-rl-2026-lecture-1.html#definition-1-1)), policies ([Definition 1.3](course-rl-2026-lecture-1.html#definition-1-3)), the regret decomposition $$R_n(\pi) = \sum_a \Delta_a\, \mathbb E_\pi[N_a(n)]$$ ([Lemma 1.6](course-rl-2026-lecture-1.html#lemma-1-6)) and the Chernoff bound ([Theorem 1.10](course-rl-2026-lecture-1.html#theorem-1-10)).

Committing to a bad arm $$a$$ for the rest of the game costs about $$n\Delta_a$$. To keep the expected cost of that mistake of order $$\Delta_a$$, its probability should be about $$1/n$$. By [Theorem 1.10](course-rl-2026-lecture-1.html#theorem-1-10), making $$e^{-s\Delta_a^2/c} \le 1/n$$ takes $$s$$ of order $$(\log n)/\Delta_a^2$$ samples of arm $$a$$, which cost about $$\Delta_a$$ each. So we expect regret of order $$\sum_{a : \Delta_a > 0} (\log n)/\Delta_a$$. This lecture proves it twice: first for explore-then-commit, which needs to know the gaps, then for UCB, which does not.

**Convention.** Throughout, rewards are 1-sub-Gaussian. This loses nothing: dividing $$\sigma$$-sub-Gaussian rewards by $$\sigma$$ makes them 1-sub-Gaussian ([Lemma 1.9(c)](course-rl-2026-lecture-1.html#lemma-1-9)), divides the gaps and the regret by $$\sigma$$, and multiplies the UCB width below by $$\sigma$$.

## 2. Policy functions and the reward table

Before analysing any policy, we give another construction of the SBM, one we can compute with: the policy's randomness comes from uniform random variables, and the rewards from a table drawn in advance.

Recall that $$\mathbb P_\pi(A_t = a \mid H_{t-1}) = \pi_t(a, H_{t-1})$$. Split $$[0, 1)$$ into $$K$$ consecutive intervals of lengths $$\pi_t(1, H_{t-1}), \dots, \pi_t(K, H_{t-1})$$; a uniform point lands in the $$a$$-th interval with probability $$\pi_t(a, H_{t-1})$$.

<figure class="pf-figure">
<svg viewBox="0 0 700 150" role="img" aria-label="The unit interval split into four pieces of lengths pi_t(a, h); a uniform point U_t lands in the second piece, so A_t = 2.">
<g font-family="var(--sans)" font-size="14">
<text x="125" y="34" text-anchor="middle" fill="var(--muted)">π<tspan font-size="10" dy="3">t</tspan><tspan dy="-3">(1, h)</tspan></text>
<text x="310" y="34" text-anchor="middle" fill="var(--muted)">π<tspan font-size="10" dy="3">t</tspan><tspan dy="-3">(2, h)</tspan></text>
<text x="470" y="34" text-anchor="middle" fill="var(--muted)">π<tspan font-size="10" dy="3">t</tspan><tspan dy="-3">(3, h)</tspan></text>
<text x="600" y="34" text-anchor="middle" fill="var(--muted)">π<tspan font-size="10" dy="3">t</tspan><tspan dy="-3">(4, h)</tspan></text>
<rect x="50" y="46" width="150" height="36" fill="none" stroke="var(--edge)" stroke-width="1.25"/>
<rect x="200" y="46" width="220" height="36" fill="var(--soft)" stroke="var(--accent)" stroke-width="2"/>
<rect x="420" y="46" width="100" height="36" fill="none" stroke="var(--edge)" stroke-width="1.25"/>
<rect x="520" y="46" width="160" height="36" fill="none" stroke="var(--edge)" stroke-width="1.25"/>
<text x="125" y="69" text-anchor="middle" fill="var(--ink)">1</text>
<text x="330" y="69" text-anchor="middle" fill="var(--ink)" font-weight="700">2</text>
<text x="470" y="69" text-anchor="middle" fill="var(--ink)">3</text>
<text x="600" y="69" text-anchor="middle" fill="var(--ink)">4</text>
<text x="50" y="104" text-anchor="middle" fill="var(--muted)">0</text>
<text x="200" y="104" text-anchor="middle" fill="var(--muted)">s<tspan font-size="10" dy="3">1</tspan></text>
<text x="420" y="104" text-anchor="middle" fill="var(--muted)">s<tspan font-size="10" dy="3">2</tspan></text>
<text x="520" y="104" text-anchor="middle" fill="var(--muted)">s<tspan font-size="10" dy="3">3</tspan></text>
<text x="680" y="104" text-anchor="middle" fill="var(--muted)">1</text>
<line x1="275" y1="82" x2="275" y2="118" stroke="var(--accent)" stroke-width="2"/>
<circle cx="275" cy="82" r="4.5" fill="var(--accent)"/>
<text x="275" y="138" text-anchor="middle" fill="var(--ink)">U<tspan font-size="10" dy="3">t</tspan><tspan dy="-3"> lands here, so A</tspan><tspan font-size="10" dy="3">t</tspan><tspan dy="-3"> = 2</tspan></text>
</g>
</svg>
</figure>

The policy function for $$K = 4$$, with $$s_a = \pi_t(1, h) + \dots + \pi_t(a, h)$$.
{: .caption}

**Definition 2.1 (policy function).** Given a policy $$\pi$$ and $$t \in \mathbb N$$, the *policy function* $$f_t : ([K] \times \mathbb R)^{t-1} \times [0, 1] \to [K]$$ is
{: #definition-2-1}

$$
f_t(h, x) = \sum_{a=1}^K a\, \mathbf 1\Big\{ \sum_{c=1}^{a-1} \pi_t(c, h) \le x < \sum_{c=1}^{a} \pi_t(c, h) \Big\}, \qquad x \in [0, 1),
$$

and $$f_t(h, 1) = K$$. For $$x \in [0, 1)$$ exactly one indicator equals 1, since the intervals partition $$[0, 1)$$. $$f_t$$ is measurable because each $$h \mapsto \pi_t(c, h)$$ is. This makes precise the "suitable functions $$f_t$$" of [Sheet 1, Exercise 8](course-rl-2026-sheet-1.html#exercise-8).

**Definition 2.2 (reward table).** Given an environment $$\nu = (\mu_1, \dots, \mu_K)$$ and the policy functions $$(f_t)_{t \in \mathbb N}$$ of a policy $$\pi$$, let $$(Y_{a,s})_{a \in [K],\, s \in \mathbb N}$$ be independent with $$Y_{a,s} \sim \mu_a$$, and let $$(U_t)_{t \in \mathbb N}$$ be i.i.d. uniform on $$[0, 1]$$, independent of the $$Y$$'s. Set $$H_0 = \emptyset$$ and, given $$H_{t-1}$$, set
{: #definition-2-2}

$$
A_t = f_t(H_{t-1}, U_t), \qquad X_t = Y_{A_t,\, N_{A_t}(t)}, \qquad H_t = (H_{t-1}, A_t, X_t).
$$

Picture a deck of cards for each arm: deck $$a$$ is $$Y_{a,1}, Y_{a,2}, \dots$$, and pulling arm $$a$$ turns over its next card. That is, the $$s$$-th time arm $$a$$ is played, it pays $$Y_{a,s}$$.

**All the randomness comes first.** The whole table $$(Y_{a,s})$$ and the uniforms $$(U_t)$$ can be sampled at the start, before round 1, and nothing new is drawn during the game. The process $$(A_t, X_t)_{t \le n}$$ is then a deterministic function of them, built by the recursion above. Turning over a card is only a picture of which entry of the table the recursion reads: nothing has to be uncovered to get an SBM. What matters is that $$A_t$$ is a function of $$U_1, \dots, U_t$$ and the cards already used, so no decision depends on a card before that card is used.

**Remark.** The two policies of this lecture, explore-then-commit and UCB, are deterministic (with ties broken in a fixed way): each $$\pi_t(\cdot, h)$$ is a point mass, so $$A_t = f_t(H_{t-1}, U_t)$$ does not depend on $$U_t$$. For them the uniforms play no role, and the reward table is just the decks $$(Y_{a,s})$$. The uniforms are needed for randomised policies, such as ε-greedy ([Exercise 2.4](course-rl-2026-sheet-2.html#exercise-2-4)) and the policies of the next lecture.

**Try it.** Deal a table, then step through a game: $$U_t$$ picks a piece of $$[0, 1)$$, and the chosen arm uses its next card.

{% include sim-reward-table.html %}

Bernoulli arms with the means set above. ε-greedy plays each arm once, then with probability 0.2 a uniform arm and otherwise an arm with the largest empirical mean; UCB is [Algorithm 2.5](#algorithm-2-5) below.
{: .caption}

**It is the same model.** When arm $$a$$ is pulled, the card used has not influenced any earlier decision, so given everything seen so far it is a fresh draw from $$\mu_a$$. Precisely, the process of [Definition 2.2](#definition-2-2) satisfies $$\mathbb P(A_t = a \mid H_{t-1}) = \pi_t(a, H_{t-1})$$ and $$\mathbb P(X_t \in \cdot \mid H_{t-1}, A_t) = \mu_{A_t}$$. Hence $$H_n$$ has law $$\mathbb P_\pi$$, and every probability and expectation computed on the reward table is the right one. See also [Exercise 2.5](course-rl-2026-sheet-2.html#exercise-2-5). Many texts take [Definition 2.2](#definition-2-2) as the definition of the bandit model; from now on we work on it.

**Empirical means.** Write

$$
\hat m_{a,s} = \frac1s \sum_{u=1}^s Y_{a,u}
$$

for the empirical mean of arm $$a$$ after $$s$$ pulls: the average of the first $$s$$ cards of deck $$a$$. For each *fixed* $$s$$ this is an average of $$s$$ independent samples from $$\mu_a$$, whatever the policy does, so [Theorem 1.10](course-rl-2026-lecture-1.html#theorem-1-10) applies to it. The empirical mean of arm $$a$$ after $$t$$ rounds is $$\hat m_a(t) = \hat m_{a, N_a(t)}$$, the same average at a *random* index.

[Theorem 1.10](course-rl-2026-lecture-1.html#theorem-1-10) does not apply directly to $$\hat m_a(t)$$: the number of samples $$N_a(t)$$ is random and depends on the cards themselves, while [Theorem 1.10](course-rl-2026-lecture-1.html#theorem-1-10) is about a fixed number of samples. The way round this, used for UCB below, is a union bound over the possible values $$s \in [n]$$ of $$N_a(t)$$.

## 3. Explore-then-commit

We now get to an explicit policy with sublinear regret.

**Algorithm 2.3 (explore-then-commit).** For a $$K$$-armed SBM with horizon $$n$$ and an integer $$\ell \ge 1$$ with $$K\ell \le n$$, the policy $$\mathrm{ETC}(\ell)$$ is as follows.
{: #algorithm-2-3}

1. In rounds $$1, \dots, K\ell$$, play each arm exactly $$\ell$$ times, in a fixed order.
2. Let $$\hat A \in \operatorname{argmax}_{a \in [K]} \hat m_{a,\ell}$$ be an arm with the largest empirical mean after round $$K\ell$$, ties broken in any fixed way.
3. In rounds $$K\ell + 1, \dots, n$$, play $$\hat A$$.

**Try it.** Run $$\mathrm{ETC}(\ell)$$ step by step on three arms.

{% include sim-etc-run.html %}

$$\mathrm{ETC}(\ell)$$ with $$n = 1000$$ on three arms with Gaussian rewards $$N(m_a, 1)$$, where $$m_1 = 0$$, $$m_2 = -\Delta$$ and $$m_3 = -2\Delta$$; the rewards are read from a reward table dealt at the start of each run. In the first $$K\ell$$ rounds the arms are played in turn; then ETC commits to the arm with the largest empirical mean and plays it to the end. With a small $$\ell$$, run it a few times: sometimes the commitment is wrong, and the pull count of a worse arm keeps climbing until round $$n$$.
{: .caption}

**Theorem 2.4 (ETC).** Given a $$K$$-armed SBM with 1-sub-Gaussian rewards, explore-then-commit performs as follows.
{: #theorem-2-4}

(a) For every $$\ell$$ with $$K\ell \le n$$,

$$
R_n(\mathrm{ETC}(\ell)) \le \ell \sum_a \Delta_a + n \sum_a \Delta_a\, e^{-\ell\Delta_a^2/4}.
$$

(b) Let $$\Delta_{\min} = \min\{\Delta_a : \Delta_a > 0\}$$. If $$\ell_{\min} = \lceil (4/\Delta_{\min}^2) \log n \rceil$$ satisfies $$K\ell_{\min} \le n$$, then

$$
R_n(\mathrm{ETC}(\ell_{\min})) \le \sum_a \Delta_a \Big(\frac{4 \log n}{\Delta_{\min}^2} + 2\Big).
$$

For $$K = 2$$ and $$\Delta = \Delta_2$$, (b) reads $$R_n \le \frac{4}{\Delta} \log n + 2\Delta$$.

*Proof of (a).* Work on the reward table, and assume without loss of generality that arm 1 is optimal, $$m_1 = m^*$$. Each pull of arm $$a$$ costs $$\Delta_a$$. Arm $$a$$ is pulled $$\ell$$ times while exploring, and $$n - K\ell$$ more times if $$\hat A = a$$. The exploration rewards of arm $$b$$ are its first $$\ell$$ cards, so $$\hat A$$ is an arm with the largest $$\hat m_{b,\ell}$$. Committing to $$a$$ requires, in particular, that $$a$$ beats arm 1; the other arms play no role. By [Lemma 1.6](course-rl-2026-lecture-1.html#lemma-1-6),

$$
\begin{aligned}
R_n &= \sum_a \Delta_a \big(\ell + (n - K\ell)\, \mathbb P(\hat A = a)\big) \\
&\le \ell \sum_a \Delta_a + n \sum_a \Delta_a\, \mathbb P(\hat m_{a,\ell} \ge \hat m_{1,\ell}).
\end{aligned}
$$

Fix $$a$$ with $$\Delta_a > 0$$ and put $$D_i = (Y_{a,i} - m_a) - (Y_{1,i} - m_1)$$. Then

$$
\hat m_{a,\ell} - \hat m_{1,\ell} = \frac1\ell \sum_{i=1}^{\ell} D_i - \Delta_a, \qquad\text{so}\qquad \{\hat m_{a,\ell} \ge \hat m_{1,\ell}\} = \Big\{\frac1\ell \sum_{i=1}^{\ell} D_i \ge \Delta_a\Big\}.
$$

The $$D_i$$ are independent (all cards are; this is where the reward table is used), have mean 0, and are $$\sqrt2$$-sub-Gaussian by [Lemma 1.9(c)](course-rl-2026-lecture-1.html#lemma-1-9) (this is where the sub-Gaussian assumption is used). [Theorem 1.10](course-rl-2026-lecture-1.html#theorem-1-10) with $$s = \ell$$, $$\sigma = \sqrt2$$ and $$\varepsilon = \Delta_a$$ gives $$\mathbb P(\hat m_{a,\ell} \ge \hat m_{1,\ell}) \le e^{-\ell\Delta_a^2/4}$$. $$\square$$

Part (b) follows by taking $$\ell = \ell_{\min}$$ in (a), using $$e^{-\ell_{\min}\Delta_a^2/4} \le n^{-\Delta_a^2/\Delta_{\min}^2} \le 1/n$$ ([Exercise 2.1](course-rl-2026-sheet-2.html#exercise-2-1)).

**Try it.** Choose the gap, the horizon and the exploration length $$\ell$$ of ETC on two Gaussian arms.

{% include sim-etc.html %}

Two arms with rewards $$N(\Delta, 1)$$ and $$N(0, 1)$$. Here the regret is computed exactly, not simulated: after $$\ell$$ pulls of each arm, $$\hat m_{2,\ell} - \hat m_{1,\ell} \sim N(-\Delta, 2/\ell)$$, so $$R_n(\mathrm{ETC}(\ell)) = \ell\Delta + (n - 2\ell)\Delta\, \mathbb P(Z \ge \Delta\sqrt{\ell/2})$$ for a standard normal $$Z$$. Both axes are logarithmic. Too little exploration risks committing to the worse arm, at a cost of about $$n\Delta$$; too much wastes $$\ell\Delta$$. The choice $$\ell_{\min}$$ of [Theorem 2.4(b)](#theorem-2-4) pushes the error probability below $$1/n$$, which is more exploration than the best $$\ell$$ needs, and both depend on $$\Delta$$.
{: .caption}

## 4. What is wrong with ETC

To choose $$\ell_{\min}$$ in [Theorem 2.4(b)](#theorem-2-4) we need $$\Delta_{\min}$$, which the learner does not know. And $$\ell_{\min}$$ is set by the smallest gap, so every arm is explored that long, even arms that are clearly bad.

**Remark.** Without $$\Delta$$, $$\ell$$ of order $$n^{2/3}$$ gives regret of order $$n^{2/3}$$, and no fixed $$\ell$$ does better ([Exercise 2.2](course-rl-2026-sheet-2.html#exercise-2-2)). With $$K$$ arms, arm $$a$$ costs about $$(\Delta_a/\Delta_{\min}^2) \cdot 4 \log n$$ in [Theorem 2.4(b)](#theorem-2-4), rather than $$(4/\Delta_a) \log n$$. UCB will fix both. Exploring much less than $$1/\Delta_{\min}^2$$ rounds per arm fails anyway, whatever the rewards ([Exercise 2.3](course-rl-2026-sheet-2.html#exercise-2-3)).

Exploring as little as possible does not work either. The *greedy* policy plays each arm once and then always plays an arm with the largest empirical mean. With rewards in $$\{0, 1\}$$, if the best arm's first reward is 0 and another arm's is 1, greedy never plays the best arm again, so its regret is linear in $$n$$ ([Exercise 2.4](course-rl-2026-sheet-2.html#exercise-2-4)). Greedy treats an estimate as the truth.

**Two ways to fail, one diagnosis.** Deciding whether arm $$a$$ is worse than the best arm is a hypothesis test, and both policies get the testing wrong. ETC runs a test of *fixed* size: it decides in advance to take $$\ell$$ samples of every arm, and $$\ell$$ is right only if $$\Delta$$ is known. Greedy runs *no* test: an arm that looks bad once is never sampled again, so an early mistake is never corrected. What we want is a *sequential* test for each arm: keep sampling arm $$a$$ until the data rule out that it is the best, however many samples its unknown gap requires, and then stop. UCB is such a test.

## 5. UCB

**Principle (optimism in the face of uncertainty).** Play the arm whose mean could be largest: the arm with the largest upper confidence bound. Greedy, but realistic.

**Confidence bounds.** Fix an arm $$a$$, a number of samples $$s$$ and $$\delta \in (0, 1)$$, and put $$w_\delta(s) = \sqrt{2 \log(1/\delta)/s}$$. The lower tail of [Theorem 1.10](course-rl-2026-lecture-1.html#theorem-1-10) ([Sheet 1, Exercise 4](course-rl-2026-sheet-1.html#exercise-4)) with $$\varepsilon = w_\delta(s)$$ gives

$$
\mathbb P\big(\hat m_{a,s} + w_\delta(s) \le m_a\big) \le e^{-s\, w_\delta(s)^2/2} = \delta. \tag{1}
$$

So $$\hat m_{a,s} + w_\delta(s)$$ is an upper bound on $$m_a$$ that fails with probability at most $$\delta$$, and it tightens as $$s$$ grows. This is where the sub-Gaussian assumption enters.

**Algorithm 2.5 (UCB).** For a $$K$$-armed SBM with horizon $$n$$ and $$\delta(n) \in (0, 1)$$, the policy $$\mathrm{UCB}(\delta(n))$$ is as follows.
{: #algorithm-2-5}

1. Play each arm once.
2. In each round $$t > K$$, play $$A_t \in \operatorname{argmax}_{a \in [K]} \mathrm{UCB}_a(t-1)$$, ties broken in any fixed way, where

$$
\mathrm{UCB}_a(t-1) = \underbrace{\hat m_a(t-1)}_{\text{exploit}} + \underbrace{\sqrt{\frac{2\log(1/\delta(n))}{N_a(t-1)}}}_{\text{explore}}.
$$

That is, $$\mathrm{UCB}_a(t-1) = \hat m_{a, N_a(t-1)} + w_{\delta(n)}(N_a(t-1))$$. With $$\delta(n) = 1/n^2$$, the bonus is $$\sqrt{4 \log n / N_a(t-1)}$$: it shrinks as arm $$a$$ is pulled, and grows slowly with the horizon.

**Try it.** Run $$\mathrm{UCB}(1/n^2)$$ step by step on three arms.

{% include sim-ucb-run.html %}

$$\mathrm{UCB}(1/n^2)$$ with $$n = 1000$$ on three arms with Gaussian rewards $$N(m_a, 1)$$, where $$m_1 = 0$$, $$m_2 = -\Delta$$ and $$m_3 = -2\Delta$$. Step through the first rounds to see how the indices decide which arm is played, then press Play. The bars are $$\hat m_a \pm w(N_a)$$, with $$w(s) = \sqrt{4 \log n / s}$$, and the thick tick is the index. A suboptimal arm keeps being played until its bonus has shrunk to about its gap; after that its index stays below $$m_1$$ and it is hardly played again. The dashed lines in the lower panel are the bounds of [Theorem 2.6](#theorem-2-6), which are loose ([Remark 2.7](#remark-2-7)).
{: .caption}

**Theorem 2.6 (UCB).** Given a $$K$$-armed SBM with 1-sub-Gaussian rewards and horizon $$n \ge K$$, $$\mathrm{UCB}(\delta(n))$$ with $$\delta(n) = 1/n^2$$ satisfies, for every arm $$a$$ with $$\Delta_a > 0$$,
{: #theorem-2-6}

$$
\mathbb E[N_a(n)] \le 3 + \frac{16 \log n}{\Delta_a^2}, \qquad\text{hence}\qquad R_n(\mathrm{UCB}) \le 3 \sum_{a=1}^K \Delta_a + \sum_{a : \Delta_a > 0} \frac{16 \log n}{\Delta_a}.
$$

Moreover $$R_n \le 8\sqrt{Kn \log n} + 3 \sum_a \Delta_a$$, whatever the gaps ([Exercise 2.6](course-rl-2026-sheet-2.html#exercise-2-6)).

*Proof.* Use the reward table ([Definition 2.2](#definition-2-2)), let arm 1 be optimal, and write $$w(s) = w_{\delta(n)}(s) = \sqrt{4 \log n/s}$$; it is the same for every arm, since all rewards are 1-sub-Gaussian. Suppose $$\Delta_a > 0$$ and fix

$$
u = \Big\lceil \frac{16 \log n}{\Delta_a^2} \Big\rceil, \qquad \text{so that} \qquad w(u) \le \frac{\Delta_a}{2}.
$$

If $$N_a(n) > u$$, then arm $$a$$ is chosen instead of arm 1 at its $$(u + 1)$$-th pull, in some round $$t > K$$, so there is some $$s \in [n]$$ (namely $$s = N_1(t-1)$$) with

$$
\hat m_{a,u} + w(u) \ge \hat m_{1,s} + w(s).
$$

Hence either $$\hat m_{a,u} + w(u) \ge m_1$$, or $$\hat m_{1,s} + w(s) \le m_1$$ for some $$s \in [n]$$. Therefore

$$
\mathbb P\big(N_a(n) > u\big) \le \mathbb P\big(\exists s \in [n] : \hat m_{1,s} + w(s) \le m_1\big) + \mathbb P\big(\hat m_{a,u} + w(u) \ge m_1\big).
$$

By (1) and a union bound over $$s \in [n]$$, the first probability is at most $$n\delta(n) = 1/n$$; (1) applies because, on the reward table, $$\hat m_{1,s}$$ is an average of $$s$$ independent samples for each fixed $$s$$. For the second, using $$w(u) \le \Delta_a/2$$ and the upper tail of [Theorem 1.10](course-rl-2026-lecture-1.html#theorem-1-10) (this is where the rewards being 1-sub-Gaussian is used),

$$
\mathbb P\big(\hat m_{a,u} + w(u) \ge m_1\big) \le \mathbb P\Big(\hat m_{a,u} - m_a \ge \frac{\Delta_a}{2}\Big) \le e^{-u\Delta_a^2/8} \le \frac1{n^2}.
$$

Thus, since $$N_a(n) \le n$$,

$$
\mathbb E[N_a(n)] \le u + n\, \mathbb P\big(N_a(n) > u\big) \le \frac{16 \log n}{\Delta_a^2} + 1 + n\Big(\frac1n + \frac1{n^2}\Big) \le \frac{16 \log n}{\Delta_a^2} + 3.
$$

The regret bound follows from [Lemma 1.6](course-rl-2026-lecture-1.html#lemma-1-6). $$\square$$

**The proof as a test.** The proof splits into the two ways a test can go wrong. The first event is a false rejection of the true best arm: its bound drops below $$m_1$$ at some sample size, probability at most $$1/n$$. The second is a failure to reject arm $$a$$ after $$u$$ samples: its bound is still above $$m_1$$, probability at most $$1/n^2$$. Apart from these, arm $$a$$ is sampled at most $$u \approx 16 \log n/\Delta_a^2$$ times, which is the sample size [Theorem 1.10](course-rl-2026-lecture-1.html#theorem-1-10) needs to reject "arm $$a$$ is best" at level $$1/n^2$$. So UCB runs one sequential test per arm, each stopping by itself once its arm is ruled out, without knowing $$\Delta_a$$.

**Remark 2.7.**
{: #remark-2-7}

1. **$$\Delta$$ is not used by the algorithm**, only by the analysis, and each arm is explored according to its own gap: $$16 \log n/\Delta_a^2$$ pulls, against $$4 \log n/\Delta_{\min}^2$$ for every arm in ETC ([Section 4](#4-what-is-wrong-with-etc)). This is the gain over ETC.
2. **The constant 16 is loose.** We were wasteful in $$w(u) \le \Delta_a/2$$ and in $$\delta = 1/n^2$$. A more careful confidence level gives $$\limsup_n R_n/\log n \le \sum_{a : \Delta_a > 0} 2/\Delta_a$$ for Gaussian rewards (stated without proof; see Lattimore–Szepesvári, Chapter 8). Lecture 5 shows $$2/\Delta_a$$ cannot be beaten (Lai–Robbins).
3. **$$\delta$$ must shrink with $$n$$.** With a fixed $$\delta$$, the optimal arm is underestimated forever with positive probability, and regret is linear. $$\mathrm{UCB}(1/n^2)$$ needs to know $$n$$. Letting the confidence level depend on the round instead, roughly $$\delta_t = 1/t^2$$, gives a version that does not, with a bound of the same form (Lattimore–Szepesvári, Chapter 8).
4. **Two kinds of guarantee.** The first bound in [Theorem 2.6](#theorem-2-6) is instance-dependent: fix $$\nu$$, then let $$n$$ grow. The "moreover" bound is worst-case: fix $$n$$, then take the supremum over $$\nu$$. The worst environment for horizon $$n$$ may depend on $$n$$ (here, gaps of order $$\sqrt{K \log n/n}$$), but each environment is an ordinary SBM, fixed for the whole run. The minimax regret over a class $$\mathcal E$$ of environments is $$R_n^*(\mathcal E) = \inf_\pi \sup_{\nu \in \mathcal E} R_n(\pi, \nu)$$; Lecture 4 shows $$R_n^* \ge c\sqrt{Kn}$$ for Gaussian arms, so the worst-case bound is optimal up to $$\sqrt{\log n}$$. [Exercise 2.2(b)](course-rl-2026-sheet-2.html#exercise-2-2) is a first example of choosing the environment after $$n$$.

**Try it: the confidence level.** Run UCB with $$\delta = n^{-c}$$ for a range of exponents $$c$$.

{% include sim-ucb.html %}

Two arms with rewards $$N(\Delta, 1)$$ and $$N(0, 1)$$, and UCB with $$\delta = n^{-c}$$, so the exploration bonus is $$\sqrt{2c \log n / N_a}$$; $$c = 0$$ is greedy. Every value of $$c$$ is run on the same reward tables ([Definition 2.2](#definition-2-2)), so within a run the points differ only through $$c$$. For small $$c$$ the better arm is sometimes underestimated for good, and the regret is large ([Remark 2.7](#remark-2-7)(3)); for large $$c$$, UCB explores more than it needs to. The choice $$c = 2$$ is what the proof of [Theorem 2.6](#theorem-2-6) needs for every gap at once. In a single environment a smaller $$c$$ often does better, and the bound of [Theorem 2.6](#theorem-2-6) lies far above the actual regret ([Remark 2.7](#remark-2-7)(2)).
{: .caption}

**Try it: ETC against UCB.** The regret at a fixed horizon, as the gap varies.

{% include sim-etc-ucb.html %}

Regret at horizon $$n$$ against the gap, for two arms with rewards $$N(\Delta, 1)$$ and $$N(0, 1)$$; both axes are logarithmic. The ETC curves are exact and the UCB curve is simulated. For tiny gaps every policy has regret of order $$n\Delta$$, because $$n$$ rounds are not enough to tell the arms apart. ETC with $$\ell = \lceil n^{2/3} \rceil$$ needs no knowledge of $$\Delta$$, but keeps paying about $$n^{2/3}\Delta$$ for exploring when the arms are easy to tell apart. ETC with the best $$\ell$$ for each gap can beat UCB, but only by knowing $$\Delta$$, and the choice $$\ell_{\min}$$ of [Theorem 2.4(b)](#theorem-2-4) can do worse than UCB. UCB adapts to the gap without knowing it; its regret is largest for gaps of order $$\sqrt{K \log n / n}$$ ([Remark 2.7](#remark-2-7)(4)).
{: .caption}

## 6. Next lecture

UCB is deterministic, and explores by computing confidence bounds. Next time we explore by randomising instead: each arm is played with the probability that it is the best, given what has been seen so far.

## Check yourself

Six true-or-false questions on this lecture. Decide, then click to see the reasoning; nothing is recorded.

{% include quiz-lecture-2.html %}

## Reading

T. Lattimore and C. Szepesvári, *Bandit Algorithms*, Cambridge University Press, 2020, freely available [online](https://tor-lattimore.com/downloads/book/book.pdf): Chapter 6 (explore-then-commit), [Section 4](#4-what-is-wrong-with-etc).6 (the reward table, there called the stack of rewards), Chapter 7 (UCB; [Theorem 2.6](#theorem-2-6) is their Theorem 7.1, the worst-case bound their Theorem 7.2).

<nav class="notes-nav" aria-label="Course notes"><a href="course-rl-2026-lecture-1.html">← Lecture 1</a><a href="course-rl-2026-sheet-2.html">Exercise Sheet 2</a><a href="course-rl-2026-results.html">Results so far</a><a href="course-rl-2026.html">Course page</a></nav>
