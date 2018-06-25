'use strict';

// Helper for displaying toastr messages:
const toastrHelper = {
    messagesTypes: {
        success: 'success',
        error: 'error',
    },
    showWeekDayMessage(message, type = this.messagesTypes.success) {
        toastr[type](message);
    },
    showColoredMessage(message, type) {
        toastr[type](message)
    },
};

const validate = {
    rules: {
        fName: /^[A-Z][a-z -]{2,10}$/,
        email: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
    },
    messages: {
        fName: 'First Name is not in the correct format',
        email: 'Email is not in the correct format',
        success: 'Success. Thank you!'
    },
    inputFields() {
        const inputsArr = document.getElementsByClassName('len100');
        const delay = 2500;

        for (const key in inputsArr) {
            const inputField = inputsArr[key];

            if (inputField.value !== undefined) {
                if (!this.rules[inputField.id].test(inputField.value)) {
                    toastrHelper.showColoredMessage(this.messages[inputField.id], toastrHelper.messagesTypes.error);
                    return;
                }
            }
        }

        // Save client's data
        const obj = {
            fName: document.getElementById('fName').value,
            email: document.getElementById('email').value
        };

        localStorage.setItem(calendarHelper.changeableVariables.formID, JSON.stringify(obj));
        calendarHelper.changeableVariables.closeBtn.click();

        toastrHelper.showColoredMessage(this.messages.success, toastrHelper.messagesTypes.success);

        calendarHelper.changeableVariables.loader.style.display = 'block';

        setTimeout(() => {
            window.location.reload(false);
        }, delay);
    },
};

/** Variables and methods 
 * that fill the templateOfDays string
 * so it can be inserted later */
const calendarHelper = {
    changeableVariables: {
        templateOfDays: '',
        modal: '',
        closeBtn,
        submitBtn: '',
        arrowTimesClicked: 0,
        formID: '',
        checkFormID: '',
        loader: document.getElementById('loading')
    },
    dates: {
        lastDayOfCurrentMonthIndex: 0,
        daysCountFromNextMonth: 0,
        totalDaysForThisMonth: moment().daysInMonth(),
        currentDayIndex: 0,
        day1IndexOfCurrentMonth: parseInt(moment().startOf('month').format('d')),
        changedYear: 0,
        prevMonthCountOfDays: 0,
        nextMonth2Digits: 0,
        currentMonth2Digits: 0,
        prevMonth: 0,
        prevYear: 0,
        nextMonth: 0,
        nextYear: 0,
        changedMonthString: '',
        changedMonth2Digits: '',
    },
    get todaysMonthYear() {
        return this.todaysDateAs('MMMM YYYY');
    },
    get todaysDateMonthYear() {
        return this.todaysDateAs('DD MMMM YYYY');
    },
    lastDayOfCurrentMonthIndexMethod() {
        return parseInt(moment().add(this.changeableVariables.arrowTimesClicked, 'months').endOf('month').format('d'));
    },
    todaysDateAs(format) {
        return moment().format(format);
    },
    get prevMonthCountOfDaysGetter() {
        return this.prevMonthCountOfDaysMethod('DD');
    },
    prevMonthCountOfDaysMethod(format) {
        return moment().add(calendarHelper.changeableVariables.arrowTimesClicked - 1, 'month').endOf('month').format(format) - calendarHelper.dates.day1IndexOfCurrentMonth;
    },
    currentMonth2DigitsMethod() {
        return this.dates.currentMonth2Digits = moment().add(this.changeableVariables.arrowTimesClicked, 'months').format('MM');
    },
    getNextMonthWith2Digits() {
        return this.dates.nextMonth2Digits = moment().add(this.changeableVariables.arrowTimesClicked + 1, 'months').format('MM');
    },
    changedMonthYear() {
        this.dates.changedMonthString = this.setChangedMonthAndYear('MMMM');
        this.dates.changedMonth2Digits = this.setChangedMonthAndYear('MM');
        this.dates.changedYear = parseInt(this.setChangedMonthAndYear('YYYY'));

        return this.setChangedMonthAndYear('MMMM YYYY');
    },
    setChangedMonthAndYear(format) {
        return moment().add(this.changeableVariables.arrowTimesClicked, 'months').format(format);
    }
};

/** This object will create 
 * everything that is needed to
 * generate the calendar UI */
const calendar = {
    // Initialize the whole calendar
    initialize() {
        this.renderHeader();
        this.createPrevDays();
        this.createCurrentDays();
        this.createNextDays();
        this.insertCreatedDays();
        this.reCreateWholeCalendarForPreviousMonth();
        this.reCreateWholeCalendarForNextMonth();
    },
    // Create calendar header
    renderHeader() {
        document.getElementById('h1').innerHTML = `Today: ${calendarHelper.todaysDateMonthYear}`;
    },
    get prevMonthGetter() {
        return calendarHelper.dates.prevMonth = moment().add(calendarHelper.changeableVariables.arrowTimesClicked - 1, 'months').format('MM');
    },
    get prevYearGetter() {
        return calendarHelper.dates.prevYear = parseInt(moment().add(calendarHelper.changeableVariables.arrowTimesClicked - 1, 'months').format('YYYY'));
    },
    get nextMonthGetter() {
        return calendarHelper.dates.nextMonth = moment().add(calendarHelper.changeableVariables.arrowTimesClicked + 1, 'months').format('MM');
    },
    get nextYearGetter() {
        return calendarHelper.dates.nextYear = parseInt(moment().add(calendarHelper.changeableVariables.arrowTimesClicked + 1, 'months').format('YYYY'));
    },
    // Create calendar days from previous month
    createPrevDays() {
        this.prevMonthGetter;
        this.prevYearGetter;

        calendarHelper.dates.day1IndexOfCurrentMonth = parseInt(moment().add(calendarHelper.changeableVariables.arrowTimesClicked, 'month').startOf('month').format('d'));
        calendarHelper.dates.prevMonthCountOfDays = calendarHelper.prevMonthCountOfDaysGetter;

        if (calendarHelper.dates.prevMonth < 1) {
            calendarHelper.dates.prevMonth = 12;
        }

        this.addDaysFromPrevMonthInTemplateOfDays(calendarHelper.dates.day1IndexOfCurrentMonth);
    },
    addDaysFromPrevMonthInTemplateOfDays(firstOfMonth) {
        Array(firstOfMonth).fill().map((days, index) => {
            calendarHelper.dates.prevMonthCountOfDays += 1;

            calendarHelper.changeableVariables.templateOfDays +=
                `<div data-day='${calendarHelper.dates.prevMonthCountOfDays}' data-month='${calendarHelper.dates.prevMonth}' data-year='${calendarHelper.dates.prevYear}' class="day"><span class="prevWeekDays">${calendarHelper.dates.prevMonthCountOfDays}</span></div>`;
        });
    },
    // Create calendar days for current month
    createCurrentDays() {
        calendarHelper.dates.currentDayIndex = (moment().date()) + calendarHelper.dates.day1IndexOfCurrentMonth - 1;
        calendarHelper.currentMonth2DigitsMethod();
        calendarHelper.changedMonthYear();

        this.addCurrentDaysToTemplateOfDays();
    },
    addCurrentDaysToTemplateOfDays() {
        const generateCurrentDays = (daysInMonth) =>
            Array(daysInMonth).fill().map((days, index) => {
                let activeClass = '';

                calendarHelper.changeableVariables.checkFormID = `${this.prependZeroToNumber(index + 1)}-${calendarHelper.dates.currentMonth2Digits}-${calendarHelper.dates.changedYear}`;

                // Add ! to date with client data submition
                if (localStorage.getItem(calendarHelper.changeableVariables.checkFormID)) {
                    // Add blue background color to today's field
                    if (calendarHelper.todaysMonthYear === calendarHelper.changedMonthYear() && index + calendarHelper.dates.day1IndexOfCurrentMonth === calendarHelper.dates.currentDayIndex) {
                        activeClass = ' blue';
                    }

                    calendarHelper.changeableVariables.templateOfDays +=
                        `<div data-day='${this.prependZeroToNumber(index + 1)}' data-month='${calendarHelper.dates.currentMonth2Digits}' data-year='${calendarHelper.dates.changedYear}' class="day${activeClass}">
                        <span class="weekDays">${index + 1}</span>
                        <div class="tooltip" onmouseover="showLocalStorageDataAsTooltipAsTooltip(event, this)">!
                            <span class="tooltiptext"></span>
                        </div>
                     </div>`;

                    activeClass = '';
                } else {
                    // Add blue background color to today's field                    
                    if (calendarHelper.todaysMonthYear === calendarHelper.changedMonthYear() && index + calendarHelper.dates.day1IndexOfCurrentMonth === calendarHelper.dates.currentDayIndex) {
                        activeClass = ' blue';
                    }

                    calendarHelper.changeableVariables.templateOfDays +=
                        `<div data-day='${this.prependZeroToNumber(index + 1)}' data-month='${calendarHelper.dates.currentMonth2Digits}' data-year='${calendarHelper.dates.changedYear}' class="day${activeClass}">
                            <span class="weekDays">${index + 1}</span>
                         </div>`;

                    activeClass = '';
                }
            });

        generateCurrentDays(calendarHelper.dates.totalDaysForThisMonth);
    },
    // Create calendar days from next month
    createNextDays() {
        calendarHelper.getNextMonthWith2Digits();

        calendarHelper.lastDayOfCurrentMonthIndex = calendarHelper.lastDayOfCurrentMonthIndexMethod();
        calendarHelper.dates.daysCountFromNextMonth = 6 - calendarHelper.lastDayOfCurrentMonthIndex;

        this.addDaysFromNextMonthToTemplateOfDays();
    },
    addDaysFromNextMonthToTemplateOfDays() {
        const generateNextDays = (daysCountFromNextMonth) => {
            if (calendarHelper.dates.nextMonth2Digits === '01') {
                calendarHelper.dates.changedYear++;
            }

            Array(daysCountFromNextMonth).fill().map((days, index) => {
                calendarHelper.changeableVariables.templateOfDays +=
                    `<div data-day='${this.prependZeroToNumber(index + 1)}' data-month='${calendarHelper.dates.nextMonth2Digits}' data-year='${calendarHelper.dates.changedYear}' class="day"><span class="prevWeekDays">${index + 1}</span></div>`;
            });

            document.getElementById('centered').textContent = calendarHelper.changedMonthYear();
        }

        generateNextDays(calendarHelper.dates.daysCountFromNextMonth);
    },
    /** Insert all created dates into calendar days container
     and add EventListeners to modal */
    insertCreatedDays() {
        document.getElementById('calendar').innerHTML = calendarHelper.changeableVariables.templateOfDays;

        // Add all event listeners and toasr for displaying messages
        this.modalWindowFunctionality();
    },
    // Previous month arrow clicked
    reCreateWholeCalendarForPreviousMonth() {
        const leftArrow = document.getElementById('arrow1');

        leftArrow.addEventListener('click', () => {
            calendarHelper.changeableVariables.arrowTimesClicked--;

            // Create and insert changedMonth header
            document.getElementById('centered').textContent = calendarHelper.changedMonthYear();

            calendarHelper.changeableVariables.templateOfDays = '';
            calendarHelper.dates.totalDaysForThisMonth = moment(`${calendarHelper.dates.prevYear}-${calendarHelper.dates.prevMonth}`, 'YYYY-MM').daysInMonth();

            // Create calendar days
            this.createPrevDays();
            this.createCurrentDays();
            this.createNextDays();

            // Render the calendar days
            this.insertCreatedDays();
        });
    },
    // Next month arrow clicked
    reCreateWholeCalendarForNextMonth() {
        document.getElementById('arrow2').addEventListener('click', () => {
            this.nextMonthGetter;
            this.nextYearGetter;

            calendarHelper.changeableVariables.arrowTimesClicked++;

            // Create and insert changedMonth header
            document.getElementById('centered').textContent = calendarHelper.changedMonthYear();

            calendarHelper.changeableVariables.templateOfDays = '';
            calendarHelper.dates.totalDaysForThisMonth = moment(`${calendarHelper.dates.nextYear}-${calendarHelper.dates.nextMonth}`, 'YYYY-MM').daysInMonth();

            // Create new calendar days
            this.createPrevDays();
            this.createCurrentDays();
            this.createNextDays();

            // Overwrite old calendar days            
            this.insertCreatedDays();
        });
    },
    // Use toastr
    displayWeekDayMessage(dataset) {
        const clickedWeekDay = moment(`${dataset.year}-${dataset.month}-${dataset.day}`).format('dddd');

        toastrHelper.showWeekDayMessage(clickedWeekDay);
    },
    // Add 0 to single character days
    // moje da zamenq tozi method s .format('MM')
    prependZeroToNumber(date) {
        if (date < 10) {
            date = `0${date}`;
        }

        return date;
    },
    closeModal() {
        calendarHelper.changeableVariables.modal.style.display = 'none';
    },
    // Close modal pop-up by clicking outside of it
    outsideClickClose(e) {
        if (e.target == calendarHelper.changeableVariables.modal) {
            calendarHelper.changeableVariables.modal.style.display = 'none';
        }
    },
    // Enter btn submits the modal form
    submitWithEnter() {
        const fNameInput = document.getElementById('fName');
        const fNameEmail = document.getElementById('email');

        fNameInput.addEventListener("keypress", keyPressed);
        fNameEmail.addEventListener("keypress", keyPressed);
    },
    closeModalWithEscapeKey() {
        document.onkeydown = function (evt) {
            evt = evt || window.event;
            if (evt.keyCode == 27) {
                calendarHelper.changeableVariables.closeBtn.click();
            }
        };
    },
    // Get localStorage object and fill form input fields if needed                   
    fillInputFieldsWithDataFromLocalStorage() {
        // Get 2 input fields and empty them
        const fNameInput = document.getElementById('fName');
        const fNameEmail = document.getElementById('email');

        fNameInput.value = '';
        fNameEmail.value = '';

        // Insert values in 2 input fields
        const LSobject = localStorage.getItem(calendarHelper.changeableVariables.formID);

        if (LSobject) {
            const {
                fName,
                email
            } = JSON.parse(localStorage.getItem(calendarHelper.changeableVariables.formID));

            fNameInput.value = fName;
            fNameEmail.value = email;
        }
    },
    /** Toastr single and double click events on all days,
     * fill input fields if data in localStorage exists */
    toastrDisplay() {
        let [delay, clicks, timer] = [250, 0, 0];

        Array.from(document.getElementsByClassName('day')).forEach((div) => {
            div.addEventListener('click', (event) => {
                if (event.target.className === 'tooltip') return;

                clicks++;

                if (clicks === 1) {
                    timer = setTimeout(() => {
                        this.displayWeekDayMessage(event.target.dataset);
                        clicks = 0;
                    }, delay)
                }

                if (clicks > 1) {
                    // Show modal
                    calendarHelper.changeableVariables.modal.style.display = 'block';

                    const day = event.target.dataset.day;
                    const month = event.target.dataset.month;
                    const year = event.target.dataset.year;
                    calendarHelper.changeableVariables.formID = `${day}-${month}-${year}`;

                    this.submitWithEnter();
                    this.closeModalWithEscapeKey();

                    clearTimeout(timer);
                    clicks = 0;

                    this.fillInputFieldsWithDataFromLocalStorage();

                    // Autofocus on first input field
                    document.getElementById("fName").focus();
                }
            }, false);
        });
    },
    // Add event listener on modal window 
    modalWindowFunctionality() {
        calendarHelper.changeableVariables.modal = document.getElementById('modalBox');
        calendarHelper.changeableVariables.closeBtn = document.getElementById('closeBtn');
        calendarHelper.changeableVariables.submitBtn = document.getElementById('submit');

        calendarHelper.changeableVariables.closeBtn.addEventListener('click', () => this.closeModal());
        calendarHelper.changeableVariables.modal.addEventListener('click', e => this.outsideClickClose(e));
        calendarHelper.changeableVariables.submitBtn.addEventListener('click', e => this.validateBeforeSubmit(e));

        this.toastrDisplay();
    },
    // Validate user's data and submit it to local storage by clicking modal's SUMBIT button
    validateBeforeSubmit(e) {
        validate.inputFields();
    },
};

calendar.initialize();

function showLocalStorageDataAsTooltipAsTooltip(event, element) {
    const parent = element.parentElement;
    const day = parent.dataset.day;
    const month = parent.dataset.month;
    const year = parent.dataset.year;
    const lookForFormId = `${day}-${month}-${year}`;

    if (localStorage.getItem(lookForFormId)) {
        const fName = JSON.parse(localStorage.getItem(lookForFormId)).fName;
        const email = JSON.parse(localStorage.getItem(lookForFormId)).email;

        element.children[0].innerHTML = `Name:<br>${fName}<br>Email:${email}`;
    }
}

function keyPressed(k) {
    if (k.code === 'Enter' || k.code === 'NumpadEnter') {
        calendarHelper.changeableVariables.submitBtn.click();
    }
}