export class CodeComment {
	lines: string[];

	constructor(text: string) {
		this.lines = text.split('\n').map((x) => x.trim());
	}
}


export class AnswerOption {
	correct: boolean;
	text: string;

	constructor(correct: boolean, text: string) {
		this.correct = correct;
		this.text = text;
	}
}

class Problem {
	lines: string[];
	correctLines: string[];
	options: AnswerOption[];
	comments: Record<number, CodeComment>;

	constructor(
		lines: string,
		correctLines: string,
		options: AnswerOption[],
		comments: Record<number, CodeComment>
	) {
		this.lines = lines.split('\n').map((x) => x.trim());
		this.correctLines = correctLines.split('\n').map((x) => x.trim());
		this.options = options;
		this.comments = comments;
	}
}

export const problems = [
	new Problem(
		`System.out.println(x);
        int x = 0;`,
		`int x = 0;
        System.out.println(x);`,
		[
			new AnswerOption(true, 'Use before initialize'),
			new AnswerOption(false, 'Missing quotes'),
			new AnswerOption(false, 'No error')
		],
		{ 0: new CodeComment('Variables must be initialized before they can be used') }
	),
	new Problem(
		`String message = ...;
        System.out.println("message");`,
		`String message = ...;
        System.out.println(message);`,
		[
			new AnswerOption(true, 'Probably unneeded quotes'),
			new AnswerOption(false, 'Invalid type'),
			new AnswerOption(false, 'No error')
		],
		{ 1: new CodeComment('This is probably what the coder meant to write') }
	),
];
