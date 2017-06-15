module.exports = function() {


	// defining patterns
	var replaceChars = {
		// Day
		d: function() { return (this.getDate() < 10 ? '0' : '') + this.getDate(); },
		D: function() { return Date.shortDays[this.getDay()]; },
		j: function() { return this.getDate(); },
		l: function() { return Date.longDays[this.getDay()]; },
		N: function() { return (this.getDay() === 0 ? 7 : this.getDay()); },
		S: function() { return (this.getDate() % 10 == 1 && this.getDate() != 11 ? 'st' : (this.getDate() % 10 == 2 && this.getDate() != 12 ? 'nd' : (this.getDate() % 10 == 3 && this.getDate() != 13 ? 'rd' : 'th'))); },
		w: function() { return this.getDay(); },
		z: function() { var d = new Date(this.getFullYear(),0,1); return Math.ceil((this - d) / 86400000); }, // Fixed now
		// Week
		W: function() {
			var target = new Date(this.valueOf());
			var dayNr = (this.getDay() + 6) % 7;
			target.setDate(target.getDate() - dayNr + 3);
			var firstThursday = target.valueOf();
			target.setMonth(0, 1);
			if (target.getDay() !== 4) {
				target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
			}
			return 1 + Math.ceil((firstThursday - target) / 604800000);
		},
		// Month
		F: function() { return Date.longMonths[this.getMonth()]; },
		m: function() { return (this.getMonth() < 9 ? '0' : '') + (this.getMonth() + 1); },
		M: function() { return Date.shortMonths[this.getMonth()]; },
		n: function() { return this.getMonth() + 1; },
		t: function() {
			var year = this.getFullYear(), nextMonth = this.getMonth() + 1;
			if (nextMonth === 12) {
				year = year++;
				nextMonth = 0;
			}
			return new Date(year, nextMonth, 0).getDate();
		},
		// Year
		L: function() { var year = this.getFullYear(); return (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)); },   // Fixed now
		o: function() { var d  = new Date(this.valueOf());  d.setDate(d.getDate() - ((this.getDay() + 6) % 7) + 3); return d.getFullYear();}, //Fixed now
		Y: function() { return this.getFullYear(); },
		y: function() { return ('' + this.getFullYear()).substr(2); },
		// Time
		a: function() { return this.getHours() < 12 ? 'am' : 'pm'; },
		A: function() { return this.getHours() < 12 ? 'AM' : 'PM'; },
		B: function() { return Math.floor((((this.getUTCHours() + 1) % 24) + this.getUTCMinutes() / 60 + this.getUTCSeconds() / 3600) * 1000 / 24); }, // Fixed now
		g: function() { return this.getHours() % 12 || 12; },
		G: function() { return this.getHours(); },
		h: function() { return ((this.getHours() % 12 || 12) < 10 ? '0' : '') + (this.getHours() % 12 || 12); },
		H: function() { return (this.getHours() < 10 ? '0' : '') + this.getHours(); },
		i: function() { return (this.getMinutes() < 10 ? '0' : '') + this.getMinutes(); },
		s: function() { return (this.getSeconds() < 10 ? '0' : '') + this.getSeconds(); },
		u: function() { var m = this.getMilliseconds(); return (m < 10 ? '00' : (m < 100 ?
	'0' : '')) + m; },
		// Timezone
		e: function() { return /\((.*)\)/.exec(new Date().toString())[1]; },
		I: function() {
			var DST = null;
				for (var i = 0; i < 12; ++i) {
						var d = new Date(this.getFullYear(), i, 1);
						var offset = d.getTimezoneOffset();

						if (DST === null) DST = offset;
						else if (offset < DST) { DST = offset; break; }                     else if (offset > DST) break;
				}
				return (this.getTimezoneOffset() == DST) | 0;
			},
		O: function() { return (-this.getTimezoneOffset() < 0 ? '-' : '+') + (Math.abs(this.getTimezoneOffset() / 60) < 10 ? '0' : '') + Math.floor(Math.abs(this.getTimezoneOffset() / 60)) + (Math.abs(this.getTimezoneOffset() % 60) === 0 ? '00' : ((Math.abs(this.getTimezoneOffset() % 60) < 10 ? '0' : '')) + (Math.abs(this.getTimezoneOffset() % 60))); },
		P: function() { return (-this.getTimezoneOffset() < 0 ? '-' : '+') + (Math.abs(this.getTimezoneOffset() / 60) < 10 ? '0' : '') + Math.floor(Math.abs(this.getTimezoneOffset() / 60)) + ':' + (Math.abs(this.getTimezoneOffset() % 60) === 0 ? '00' : ((Math.abs(this.getTimezoneOffset() % 60) < 10 ? '0' : '')) + (Math.abs(this.getTimezoneOffset() % 60))); }, // Fixed now
		T: function() { return this.toTimeString().replace(/^.+ \(?([^\)]+)\)?$/, '$1'); },
		Z: function() { return -this.getTimezoneOffset() * 60; },
		// Full Date/Time
		c: function() { return this.format("Y-m-d\\TH:i:sP"); }, // Fixed now
		r: function() { return this.toString(); },
		U: function() { return this.getTime() / 1000; }
	};

	// Simulates PHP's date function
	Date.prototype.format = function(format) {
		var date = this;
		return format.replace(/(\\?)(.)/g, function(_, esc, chr) {
			return (esc === '' && replaceChars[chr]) ? replaceChars[chr].call(date) : chr;
		});
	};

	Date.setLang = function(lang) {
		if(lang === undefined)
		{
			if(typeof window === "undefined") // in node
				lang = "fr";
			else
				lang = navigator.language || navigator.userLanguage;
		}



		if (lang == "fr"){
			Date.shortMonths = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jui', 'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec'];
			Date.longMonths = ['Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Decembre'];
			Date.shortDays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
			Date.longDays = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
		}
		else{
			Date.shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
			Date.longMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
			Date.shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
			Date.longDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
		}

	}


	/**
	 * Incrémente ou décrémente la date 
	 *
	 * @param      {number}  jours   Le nombre de jours à incrémenter, si négatif, on décrémente.
	 */
	Date.prototype.increment = function(jours) {
		
		if(jours === undefined)
			jours = 1;

		this.setDate(this.getDate()+jours);
	};



	/**
	 * Connaitre le nombre de jours contenu dans le mois de la date
	 *
	 * @method     getNbJours
	 * @return     {Date}  Le nombre de jours du mois en cours
	 */
	Date.prototype.getNbJours = function(){
		return new Date(this.getFullYear(), this.getMonth()+1, 0).getDate();
	};

	/**
	 * Obtiens la date au formatage de la langue passée en paramètre
	 *
	 * @method     toLang
	 * @param      {<type>}  language  The language
	 */
	Date.prototype.toLang = function(language) {
		var format = {
			"fr": "d/m/Y",
			"en": "Y-m-d",
			"us": "m-d-Y",
			"default": "Y-m-d"
		};

		return this.format(format[language] || format["default"]);

	};

	Date.prototype.getLastDay = function(){
		var date = new Date(this);
		date.increment(-1);
		return date;
	};

	/**
	 * Get the date of the monday of this week.
	 *
	 * @method     getDateOfMonday
	 * @return     {Date}  La date correspondant au début de semaine
	 */
	Date.prototype.getDateOfMonday = function() {
		var days = this.getDay();
		if(days == 0)
			days = 7;

		var date = new Date(this);
		date.increment(-days+1);

		return date;
	};

	Date.prototype.getFirstDate = function() {
		var date = new Date(this);
		date.setDate(1);

		return date;
	};

	/**
	 * Gets the week number.
	 *
	 * @return     {Integer}  The week number.
	 */
	Date.prototype.getWeekNumber = function(){
		var d = new Date(+this);
		d.setHours(0,0,0);
		d.setDate(d.getDate()+4-(d.getDay()||7));
		return Math.ceil((((d-new Date(d.getFullYear(),0,1))/8.64e7)+1)/7);
	};

	Date.GetWeek = function(date) {
		var d = new Date(date);

		return d.getWeekNumber();
	};


	Date.GetMonth = function(date){
		var d = new Date(date);

		return Date.longMonths[d.getMonth()];
	};


	Date.setLang();

};
