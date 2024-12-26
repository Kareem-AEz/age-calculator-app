import { useState } from "react";
import { ReactComponent as Icon } from "./icon-arrow.svg";

const TIME_DELAY = 40; //ms
const DEFAULT_OUTPUT = "--";

export default function App() {
	return (
		<>
			<h1>Age Calculator</h1>
			<AgeCalculator />
			<Footer></Footer>
		</>
	);
}

function AgeCalculator() {
	const [age, setAge] = useState({
		years: "--",
		months: "--",
		days: "--",
	});

	return (
		<div className="age-calculator">
			<FormList setAge={setAge} />
			<OutputList age={age} />
		</div>
	);
}

function FormList({ setAge }) {
	const [day, setDay] = useState("");
	const [month, setMonth] = useState("");
	const [year, setYear] = useState("");

	const [isValidDate, setIsValidDate] = useState({
		day: true,
		month: true,
		year: true,
	});

	function handleSubmit(e) {
		e.preventDefault();

		const validationResult = validateDate(day, month, year);
		setIsValidDate(validationResult);

		// Check validationResult directly instead of isValidDate
		if (
			!validationResult.day ||
			!validationResult.month ||
			!validationResult.year
		)
			return;

		const age = calculateAge(day, month, year);
		setAge(age);
	}

	return (
		<form className="input-part">
			<div className="input-field">
				<FormField
					value={day}
					onChange={setDay}
					valid={isValidDate.day}
					placeHolder="DD"
				>
					day
				</FormField>
				<FormField
					value={month}
					onChange={setMonth}
					valid={isValidDate.month}
					placeHolder="MM"
				>
					month
				</FormField>
				<FormField
					value={year}
					onChange={setYear}
					valid={isValidDate.year}
					placeHolder="YYYY"
				>
					year
				</FormField>
			</div>
			<button onClick={handleSubmit}>
				<Icon />
			</button>
		</form>
	);
}

function FormField({ children, value, onChange, valid, placeHolder }) {
	function validateInput(e) {
		const tempValue = Number(e.target.value);
		isFinite(tempValue) && onChange(tempValue);
	}

	return (
		<div className={`form-field ${valid ? "" : "invalid"}`}>
			<label htmlFor={children}>{children}</label>
			<input
				type="text"
				id={children}
				value={value}
				onChange={validateInput}
				placeholder={placeHolder}
			/>
			<p className="error">{valid ? <br /> : `Invalid ${children}`}</p>
		</div>
	);
}

function OutputList({ age }) {
	console.log(age);

	return (
		<div className="output-part">
			<OutputPart value={age.years}>years</OutputPart>
			<OutputPart value={age.months}>months</OutputPart>
			<OutputPart value={age.days}>days</OutputPart>
			{age.days === 0 && age.months === 0 ? <p className="birthday-message">Happy Birthday!🎉</p> : <br />}
		</div>
	);
}

function OutputPart({ children, value }) {
	const [currentValue, setCurrentValue] = useState(DEFAULT_OUTPUT);

	//! first version which had a bug when the birth day or month is equal to the current day or month
	/* 
	if (isFinite(value) && currentValue !== value) {
		const initValue = 0;

		animateNumber(
			!isFinite(currentValue) ? initValue : currentValue,
			value,
			setCurrentValue
		);
	}
	*/

	// v2
	// Ensure the animation logic runs only when necessary
	if (isFinite(value) && currentValue !== value) {
		const initValue = 0;

		// If the current value is the default placeholder, initialize it
		if (currentValue === DEFAULT_OUTPUT) {
			setCurrentValue(initValue);
		} else {
			// Animate the number only when the current value is valid
			animateNumber(currentValue, value, setCurrentValue);
		}
	}

	return (
		<div className="output-field">
			<strong>{currentValue}</strong>
			<p className="output-text">{children}</p>
		</div>
	);
}

function Footer() {
	return (
		<div className="attribution">
			Challenge by{" "}
			<a
				href="https://www.frontendmentor.io?ref=challenge"
				target="_blank"
				rel="noopener noreferrer"
			>
				Frontend Mentor
			</a>
			. Coded by{" "}
			<a
				href="https://github.com/Kareem-AEz"
				target="_blank"
				rel="noopener noreferrer"
			>
				Kareem Ahmed
			</a>
			.
		</div>
	);
}

function isLeapYear(year) {
	return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

function validateDate(day, month, year) {
	const currentYear = new Date().getFullYear();

	const daysInMonth = [
		31,
		isLeapYear(year) ? 29 : 28,
		31,
		30,
		31,
		30,
		31,
		31,
		30,
		31,
		30,
		31,
	];

	const isValidYear = year >= 1900 && year <= currentYear;
	const isValidMonth = month >= 1 && month <= 12;
	const isValidDay = day >= 1 && day <= daysInMonth[month - 1];

	return {
		day: isValidDay,
		month: isValidMonth,
		year: isValidYear,
	};
}

function calculateAge(day, month, year) {
	const currentDate = new Date();
	const birthDate = new Date(year, month - 1, day); // Adjust for 0-based months

	let age = currentDate.getFullYear() - birthDate.getFullYear();
	let monthDiff = currentDate.getMonth() - birthDate.getMonth();
	let dayDiff = currentDate.getDate() - birthDate.getDate();

	// Adjust age if the current month or day hasn't reached the birth month/day
	if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
		age--;
		monthDiff += 12;
	}

	// Adjust day difference if negative
	if (dayDiff < 0) {
		const prevMonth = new Date(
			currentDate.getFullYear(),
			currentDate.getMonth() - 1,
			0
		); // Last day of the previous month
		dayDiff += prevMonth.getDate();
		monthDiff--; // Borrowing days reduces one month
	}

	return {
		years: age,
		months: monthDiff,
		days: dayDiff,
	};
}

function animateNumber(startValue, endValue, setter) {
	let currentValue = startValue;
	const increment = startValue < endValue ? 1 : -1;

	const timer = setInterval(() => {
		currentValue += increment;
		setter(currentValue);

		if (currentValue === endValue) {
			clearInterval(timer);
		}
	}, TIME_DELAY);
}
