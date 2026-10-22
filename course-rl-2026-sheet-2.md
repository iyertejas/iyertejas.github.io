---
layout: default
title: "Exercise Sheet 2"
description: "Exercise Sheet 2 for Advanced Probabilistic Methods Related to Reinforcement Learning (TU Berlin, Winter 2026/27): explore-then-commit, greedy policies, the reward table and the worst-case regret of UCB."
nav: "teaching"
body_class: "course notes"
math: true
---
# Exercise Sheet 2

[Advanced Probabilistic Methods Related to Reinforcement Learning](course-rl-2026.html) · TU Berlin · Winter 2026/27
{: .lede}

Notation as in the [Lecture 2 notes](course-rl-2026-lecture-2.html). Exercises marked <span class="tag">used later</span> are needed in later lectures.

Please report any errors or unclear points, in the lecture or by email.
{: .note}

**Exercise 2.1 (ETC: the log n bound).** Prove [Theorem 2.4(b)](course-rl-2026-lecture-2.html#theorem-2-4). For $$K = 2$$, with $$\ell = \ell_{\min}$$, what is the probability of committing to the wrong arm, and what does such a mistake cost? Minimise $$\Delta\ell + \Delta n\, e^{-\ell\Delta^2/(4\sigma^2)}$$ over real $$\ell$$ and compare.
{: #exercise-2-1}

**Exercise 2.2 (ETC without knowing $$\Delta$$).** <span class="tag">used later</span> <span class="used-in">in <a href="course-rl-2026-lecture-2.html#4-what-is-wrong-with-etc">Lecture 2, Section 4</a>; <a href="course-rl-2026-lecture-2.html#remark-2-7">Remark 2.7</a></span> A 2-armed SBM with $$\sigma$$-sub-Gaussian rewards and $$\Delta \in (0, \sigma]$$ unknown.
{: #exercise-2-2}

(a) Show that $$\ell = \lceil n^{2/3} \rceil$$ gives $$R_n \le C\sigma n^{2/3}$$ with $$C$$ independent of $$\Delta$$ and $$\sigma$$. (*Hint:* maximise $$\Delta e^{-\ell\Delta^2/(4\sigma^2)}$$ over $$\Delta$$.)

(b) For Gaussian rewards $$N(m_1, \sigma^2)$$, $$N(m_2, \sigma^2)$$ and $$n \ge 64$$, show that for every fixed $$\ell$$ the supremum over $$\Delta \in (0, \sigma]$$ of $$R_n(\mathrm{ETC}(\ell))$$ is at least $$\sigma n^{2/3}/10$$. (*Hint:* consider $$\Delta = \sigma$$ and $$\Delta = \sigma\min\{1, \sqrt{2/\ell}\}$$, and use $$\mathbb P(Z > 1) \ge 0.15$$ for a standard normal $$Z$$.)

(c) Where does (b) use that rewards are Gaussian?

**Exercise 2.3 (ETC must explore, whatever the rewards).** Let $$\mu$$ have mean 0 and variance $$\sigma^2 \in (0, \infty)$$; it need not be sub-Gaussian. For $$\Delta > 0$$, take the 2-armed SBM in which arm 1 pays $$\Delta + \xi$$ and arm 2 pays $$\xi$$, with $$\xi \sim \mu$$, so that $$m_1 = \Delta$$ and $$m_2 = 0$$. Fix $$\theta > 0$$ and run $$\mathrm{ETC}(\ell)$$ with $$\ell = \lceil \theta/\Delta^2 \rceil$$.
{: #exercise-2-3}

(a) Show that $$\mathbb P(\hat A = 2) \to \mathbb P\big(Z \ge \sqrt\theta/(\sigma\sqrt2)\big)$$ as $$\Delta \to 0$$, for a standard normal $$Z$$. (*Hint:* write $$\hat m_{2,\ell} - \hat m_{1,\ell}$$ in terms of the $$D_i$$ from the proof of [Theorem 2.4](course-rl-2026-lecture-2.html#theorem-2-4), and apply the central limit theorem to $$(D_1 + \dots + D_\ell)/\sqrt\ell$$. Note that $$\sqrt\ell\, \Delta \to \sqrt\theta$$.)

(b) Deduce that there are $$c > 0$$ and $$\Delta_0 > 0$$ such that $$R_n(\mathrm{ETC}(\ell)) \ge c\, n\Delta$$ whenever $$\Delta \le \Delta_0$$ and $$n \ge 4\ell$$.

(c) Compare with [Theorem 2.4(b)](course-rl-2026-lecture-2.html#theorem-2-4). For Gaussian $$\mu$$, $$\sigma$$ is both the standard deviation and the sub-Gaussian constant. Which part of $$\ell_{\min} = \lceil (4\sigma^2/\Delta^2) \log n \rceil$$ is forced by the fluctuations of the samples, and which part buys the small error probability $$1/n$$?

**Exercise 2.4 (greedy and ε-greedy).** <span class="tag">used later</span> <span class="used-in">in <a href="course-rl-2026-lecture-2.html#2-policy-functions-and-the-reward-table">Lecture 2, Section 2</a>; <a href="course-rl-2026-lecture-2.html#4-what-is-wrong-with-etc">Lecture 2, Section 4</a></span> The *greedy* policy plays each arm once and then always plays an arm with the largest empirical mean.
{: #exercise-2-4}

(a) Take a 2-armed SBM with rewards in $$\{0, 1\}$$ and $$m_1 > m_2$$, so $$\Delta = m_1 - m_2$$. Show that if arm 1 first pays 0 and arm 2 first pays 1, then arm 1 is never played again. Deduce that $$R_n(\mathrm{greedy}) \ge (1 - m_1)\, m_2\, (n - 1)\, \Delta$$, which is linear in $$n$$. For $$m_1 = 0.6$$ and $$m_2 = 0.5$$, how likely does this make it that greedy abandons the better arm for good?

(b) Constant ε-greedy plays a uniformly random arm with probability $$\varepsilon$$ and the greedy arm otherwise. Show $$R_n \ge \frac{\varepsilon}{K}\, n \sum_a \Delta_a$$.

**Exercise 2.5 (the reward table, by simulation).** Use the [reward table simulation](course-rl-2026-lecture-2.html#table-demo) in the Lecture 2 notes.
{: #exercise-2-5}

(a) Step through a game with ε-greedy. In each round, check that $$A_t$$ is the piece of $$[0, 1)$$ containing $$U_t$$, and that $$X_t$$ is the next card of deck $$A_t$$. Then turn on *Show the whole table*. Which cards had the policy seen when it chose $$A_t$$?

(b) Suppose a rule for choosing $$A_t$$ were allowed to look at the next unused card of each deck, and to switch to another arm when the card it was about to use is 0 and another arm's next card is 1. Why is this not a policy? Show by an example that $$\mathbb P(X_t \in \cdot \mid H_{t-1}, A_t) = \mu_{A_t}$$ fails for it.

**Exercise 2.6 (the worst-case bound).** <span class="tag">used later</span> <span class="used-in">in <a href="course-rl-2026-lecture-2.html#theorem-2-6">Theorem 2.6</a></span> Prove $$R_n \le 8\sigma\sqrt{Kn \log n} + 3 \sum_a \Delta_a$$ for [UCB](course-rl-2026-lecture-2.html#algorithm-2-5) with $$\delta = 1/n^2$$. (*Hint:* split the arms by whether $$\Delta_a$$ is above or below a threshold, and optimise the threshold.)
{: #exercise-2-6}

<nav class="notes-nav" aria-label="Course notes"><a href="course-rl-2026-sheet-1.html">← Exercise Sheet 1</a><a href="course-rl-2026-lecture-2.html">Lecture 2 notes</a><a href="course-rl-2026-results.html">Results so far</a><a href="course-rl-2026.html">Course page</a></nav>
