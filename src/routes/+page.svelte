<script lang="ts">
	import { CodeComment, problems as srcProblems, AnswerOption } from '$lib/problems';

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
				{#if ansPicked && comments[i]}
						{#each comments[i].lines as _}
						<tr>
							{#if enableLineNumber}
							<td class="line-no">&#8203;</td>
							{/if}
							<td>&#8203;</td>
						</tr>
						{/each}
				{/if}
				<tr>
					{#if enableLineNumber}
						<td class="line-no">{i + 1}</td>
					{/if}
					<td>{line}</td>
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
							<td><span class="comment">// {commentLine}</span></td>
						</tr>
						{/each}
				{/if}
				<tr>
					{#if enableLineNumber}
						<td class="line-no">{i + 1}</td>
					{/if}
					<td>{line}</td>
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
					}}>{option.text}</button
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

	ul {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		padding-bottom: 2rem;
		border-bottom: 1px solid hsl(0, 0%, 15%);
	}

	.comment {
		color: hsl(0, 0%, 55%);
	}
</style>
