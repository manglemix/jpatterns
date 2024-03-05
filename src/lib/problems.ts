export class CodeComment {
	lines: string[];

	constructor(text: string) {
		this.lines = text.split('\n').map((x) => x.trim());
	}
}

class Problem {
	lines: string[];
	correctLines: string[];
	options: string[];
	correctAnswer: number;
	comments: Record<number, CodeComment>;

	constructor(
		lines: string,
		correctLines: string,
		options: string[],
		correctAnswer: number,
		comments: Record<number, CodeComment>
	) {
		this.lines = lines.split('\n').map((x) => x.trim());
		this.correctLines = correctLines.split('\n').map((x) => x.trim());
		this.options = options;
		this.correctAnswer = correctAnswer;
		this.comments = comments;
	}
}

export const problems = [
	new Problem(
		`System.out.println(x);
        int x = 0;`,
		`int x = 0;
        System.out.println(x);`,
		['Use before initialize', 'Missing quotes', 'No error'],
		0,
		{ 0: new CodeComment('Variables must be initialized before they can be used') }
	)
];
