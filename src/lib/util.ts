export const getInitials = (string: string) => {
	const names = string.split(" ");
	let initials = names[0]?.substring(0, 1).toUpperCase();

	if (names.length > 1) {
		initials += names[names.length - 1]?.substring(0, 1)?.toUpperCase() ?? "";
	}
	return initials;
};

export const dateToString = (date: Date) => {
	const day = date.getDate().toString().padStart(2, "0");
	const month = date.toLocaleString("default", { month: "short" });
	const year = date.getFullYear();
	return `${day} ${month} ${year}`;
};

export const firstAndLastDay = (dateOrString?: Date | string) => {
	const date =
		typeof dateOrString === "string" ? new Date(dateOrString) : (dateOrString ?? new Date());

	const year = date.getFullYear();
	const month = date.getMonth();

	const firstDay = new Date(year, month, 1);
	const lastDay = new Date(year, month + 1, 0);

	return { firstDay, lastDay };
};
