<script lang="ts">
	import { CodeComment, problems as srcProblems, AnswerOption } from '$lib/problems';
	import arrow from '$lib/arrow.png';

	let problems = [...srcProblems];

	function shuffle<T>(array: T[]) {
		let currentIndex = array.length,
			randomIndex;

		// While there remain elements to shuffle.
		while (currentIndex > 0) {
			// Pick a remaining element.
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;

			// And swap it with the current element.
			[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
		}

		return array;
	}

	shuffle(problems);

	let lines = ['System.out.println("Are you ready?")'];
	let correctLines = ['System.out.println("Are you ready?");'];
	let enableLineNumber = true;
	let options = [new AnswerOption(false, 'Yes!'), new AnswerOption(true, 'Missing ;')];
	shuffle(options);
	let streak = 0;
	let ansPicked = false;
	let showOriginal = false;
	let comments: Record<number, CodeComment> = {
		0: new CodeComment('Most statements must end with a semicolon')
	};
	let showFaq = false;

	function getIndent(line: string) {
		let i = 0;
		while (line[i] == ' ') {
			i += 1;
		}
		return " ".repeat(i);
	}
</script>

<svelte:head>
	<title>
		JPatterns
	</title>
</svelte:head>

<header>
	<h1>JPatterns</h1>
	<p>
		Identifying patterns in code quickly can help you write better code in less time. This webapp
		will help you find these patterns in Java. Problems range from code smells to syntax errors.
	</p>
</header>

<main>
	<section>
		<label for="lineNumbers" style="font-style: italic">Line Numbers</label>
		<input type="checkbox" name="lineNumbers" bind:checked={enableLineNumber} />
		{#if ansPicked}
			<label for="showOriginal" style="font-style: italic; margin-left: 2rem;">Show Original</label>
			<input type="checkbox" name="showOriginal" bind:checked={showOriginal} />
		{/if}
	</section>
	<table>
		{#if !ansPicked || showOriginal}
			{#each lines as line, i}
				<!-- {#if ansPicked && comments[i]}
						{#each comments[i].lines as _}
						<tr>
							{#if enableLineNumber}
							<td class="line-no">&#8203;</td>
							{/if}
							<td>&#8203;</td>
						</tr>
						{/each}
				{/if} -->
				<tr>
					{#if enableLineNumber}
						<td class="line-no">{i + 1}</td>
					{/if}
					<td><pre>{line}</pre></td>
				</tr>
			{/each}
		{:else}
			{#each correctLines as line, i}
				{#if comments[i]}
						{#each comments[i].lines as commentLine}
						<tr>
							{#if enableLineNumber}
							<td class="line-no">&#8203;</td>
							{/if}
							<td><pre class="comment">{getIndent(line)}// {commentLine}</pre></td>
						</tr>
						{/each}
				{/if}
				<tr>
					{#if enableLineNumber}
						<td class="line-no">{i + 1}</td>
					{/if}
					<td><pre>{line}</pre></td>
				</tr>
			{/each}
		{/if}
	</table>
	<ul>
		{#each options as option}
			{#if ansPicked}
				{#if option.correct}
					<button type="button" class="right-answer" disabled>{option.text}</button>
				{:else}
					<button type="button" class="wrong-answer" disabled>{option.text}</button>
				{/if}
			{:else}
				<button
					type="button"
					on:click={() => {
						ansPicked = true;
						if (option.correct) {
							streak += 1;
						} else {
							streak = 0;
						}
					}}><pre>{option.text}</pre></button
				>
			{/if}
		{/each}
		{#if ansPicked}
			<button
				id="continue-button"
				on:click={() => {
					let problem = problems.pop();
					if (problem === undefined) {
						problems = [...srcProblems];
						shuffle(problems);
						// A way of forgiving undefined
						// The pop will never be undefined anyway
						problem = problems.pop() ?? problems[0];
					}
					lines = problem.lines;
					correctLines = problem.correctLines;
					options = problem.options;
					shuffle(options);
					comments = problem.comments;

					ansPicked = false;
					showOriginal = false;
				}}>Continue</button
			>
		{:else}
			<div style="height: 2.7rem"></div>
		{/if}
	</ul>
	<section>
		<p>Win Streak: {streak}</p>
	</section>
</main>

<footer>
	<button style="display: flex;" type=button on:click={() => showFaq = !showFaq}>FAQ <img alt="Down arrow" src={arrow} width=2rem /></button>
	{#if showFaq}
	<ul>
		<li>
			<h2>
				Who is this for?
			</h2>
			<p>
				This webapp is for students learning Java or other related languages
				who are trying to become faster coders. In assignments, you often have
				a lot of time to arrive at the right answer or get help. In an exam, you
				have to be careful with your time and your questions, and you do not have
				an IDE to help you out. Training your brain to find red flags is one of the
				easiest ways to get some points back.
			</p>
		</li>
		<li>
			<h2>
				Privacy?
			</h2>
			<p>
				No information ever leaves your browser. Currently, no cookies are stored as well.
				Your performance is not recorded, and your usage is not tracked. Not only is this
				safer for you, it also means running this webapp is free for me. All this needs
				is Javascript.
			</p>
		</li>
		<li>
			<h2>
				Code smells, red flags?
			</h2>
			<p>
				If part of your code <em>smells</em>, it means that there is a greater
				problem with your code than is immediately obvious. The vast majority of
				these hint at logical errors instead of syntax errors, so an IDE most likely
				would not help. Spotting these is not always easy and requires practice. A red
				flag is usually a glaring problem that should be easy to see. Getting good at
				catching these can lift you out of your beginner stage, and an IDE can be very
				helpful here. As a beginner, identifying these problems can be very beneficial.
			</p>
		</li>
		<li>
			<h2>
				Source code?
			</h2>
			<p>
				This webapp was written with TypeScript and SvelteKit, and the repository is completely
				public for anyone to contribute to. View it <a href="https://github.com/manglemix/jpatterns">here</a>.
			</p>
		</li>
	</ul>
	{/if}
</footer>

<style>
	@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap');

	* {
		margin: 0;
		padding: 0;
		font-family: 'JetBrains Mono', monospace;
		color: white;
	}

	button {
		background-color: hsl(0, 0%, 15%);
		padding: 0.7rem;
		border-radius: 1rem;
		text-align: left;
		font-size: 1rem;
	}

	#continue-button {
		align-self: flex-start;
	}

	.right-answer {
		background-color: #00dd00;
	}

	.wrong-answer {
		background-color: #dd0000;
	}

	:global(html) {
		background-color: hsl(0, 0%, 3%);
		display: flex;
		flex-direction: column;
		font-size: min(16px, 2.5vw);
	}

	:global(body) {
		max-width: 210mm;
		align-self: center;
		padding: 1rem;
	}

	h1 {
		font-size: 3rem;
	}

	header {
		margin-bottom: 3rem;
	}

	table {
		padding: 1rem;
		background-color: hsl(0, 0%, 7%);
		border-radius: 1.5rem;
		border: 1px solid hsl(0, 0%, 30%);
		margin-bottom: 1rem;
	}

	main {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: 0.5rem;
	}

	.line-no {
		color: hsl(0, 0%, 60%);
		width: 2rem;
	}

	main > ul {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		padding-bottom: 2rem;
		border-bottom: 1px solid hsl(0, 0%, 15%);
	}

	.comment {
		color: hsl(0, 0%, 55%);
	}

	footer {
		margin-top: 3rem;
	}

	ul {
		list-style: none;
	}

	footer > button {
		background-color: hsla(0, 0%, 0%, 0%);
		font-size: 2rem;
		font-weight: bolder;
		border: none;
		display: flex;
		align-items: baseline;
		gap: 0.5rem;
		padding: 0;
		margin-bottom: 1rem;
	}

	footer > button img {
		width: 2rem;
	}

	footer > ul {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>
