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

**Exercise 2.1 (ETC: the log n bound).** Prove Theorem 2.4(b). For $$K = 2$$, with $$\ell = \ell_{\min}$$, what is the probability of committing to the wrong arm, and what does such a mistake cost? Minimise $$\Delta\ell + \Delta n\, e^{-\ell\Delta^2/4}$$ over real $$\ell$$ and compare.

**Exercise 2.2 (ETC without knowing $$\Delta$$).** <span class="tag">used later</span> A 2-armed SBM with 1-sub-Gaussian rewards and $$\Delta \in (0, 1]$$ unknown.

(a) Show that $$\ell = \lceil n^{2/3} \rceil$$ gives $$R_n \le C n^{2/3}$$ with $$C$$ independent of $$\Delta$$. (*Hint:* maximise $$\Delta e^{-\ell\Delta^2/4}$$ over $$\Delta$$.)

(b) For Gaussian rewards $$N(m_1, 1)$$, $$N(m_2, 1)$$ and $$n \ge 64$$, show that for every fixed $$\ell$$ the supremum over $$\Delta \in (0, 1]$$ of $$R_n(\mathrm{ETC}(\ell))$$ is at least $$n^{2/3}/10$$. (*Hint:* consider $$\Delta = 1$$ and $$\Delta = \min\{1, \sqrt{2/\ell}\}$$, and use $$\mathbb P(Z > 1) \ge 0.15$$ for a standard normal $$Z$$.)

(c) Where does (b) use that rewards are Gaussian?

**Exercise 2.3 (tuning ETC with $$K$$ arms).**

(a) Give an example of a $$K$$-armed SBM where the bound of Theorem 2.4(b) is far larger than $$\sum_{a : \Delta_a > 0} (4/\Delta_a) \log n$$.

(b) Explain why no single $$\ell$$ avoids this: what does exploration cost, and what goes wrong if $$\ell$$ is much smaller than $$1/\Delta_{\min}^2$$?

(c) Compare with Theorem 2.6.

**Exercise 2.4 (greedy and ε-greedy).** <span class="tag">used later</span> The *greedy* policy plays each arm once and then always plays an arm with the largest empirical mean.

(a) Take a 2-armed SBM with rewards in $$\{0, 1\}$$ and $$m_1 > m_2$$, so $$\Delta = m_1 - m_2$$. Show that if arm 1 first pays 0 and arm 2 first pays 1, then arm 1 is never played again. Deduce that $$R_n(\mathrm{greedy}) \ge (1 - m_1)\, m_2\, (n - 1)\, \Delta$$, which is linear in $$n$$. For $$m_1 = 0.6$$ and $$m_2 = 0.5$$, how likely does this make it that greedy abandons the better arm for good?

(b) Constant ε-greedy plays a uniformly random arm with probability $$\varepsilon$$ and the greedy arm otherwise. Show $$R_n \ge \frac{\varepsilon}{K}\, n \sum_a \Delta_a$$.

**Exercise 2.5 (the reward table, by simulation).** Use the [reward table simulation](course-rl-2026-lecture-2.html#table-demo) in the Lecture 2 notes.

(a) Step through a game with ε-greedy. In each round, check that $$A_t$$ is the piece of $$[0, 1)$$ containing $$U_t$$, and that $$X_t$$ is the next card of deck $$A_t$$. Then turn on *Show the whole table*. Which cards had the policy seen when it chose $$A_t$$?

(b) Under *Same game, three constructions*, compare the law of $$N_1(n)$$ under Definition 1.1, Definition 2.2 and the table indexed by round (Sheet 1, Exercise 8). Then add the rule that peeks at the next card. Why is it not a policy, and why does the identity $$\mathbb E\big[\sum_t X_t\big] = \sum_a m_a\, \mathbb E[N_a(n)]$$ fail for it?

**Exercise 2.6 (the worst-case bound).** <span class="tag">used later</span> Prove $$R_n \le 8\sqrt{Kn \log n} + 3 \sum_a \Delta_a$$ for UCB with $$\delta = 1/n^2$$. (*Hint:* split the arms by whether $$\Delta_a$$ is above or below a threshold, and optimise the threshold.)
