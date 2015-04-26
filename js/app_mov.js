$(function(){
    var model = {
        init: function(){

            if (!localStorage.attendance) {
				var objDate = new Date(Date.now()),
					locale = "pt-br",
					year = objDate.getFullYear(),
					month = objDate.getMonth();

			    this.strMonth = objDate.toLocaleString(locale, { month: "long", year: "numeric" });

				function daysInMonth(month,year) {
				    return new Date(year, month+1, 0).getDate();
				}

				this.days = daysInMonth(month,year);

		        console.log('Creating attendance records...');
		        function getRandom() {
		            return (Math.random() >= 0.5);
		        }

		        var nameColumns = [
					'Slappy the Frog','Lilly the Lizard','Paulrus the Walrus',
					'Gregory the Goat', 'Adam the Anaconda'
		        ],
		            attendance = {};

		        nameColumns.forEach(function(name) {
		            attendance[name] = [];

		            for (var i = 1; i <= model.days; i++) {
					    attendance[name].push(getRandom());
		            }
		        });

		        localStorage.attendance = JSON.stringify(attendance);
		    }
        },

        getRecords: function(){
        	return JSON.parse(localStorage.attendance);
        },

        getDays: function(){
			return this.days;
        },

        getMonth: function(){
			return this.strMonth;
        },

        getNames: function(){
			var obj = model.getRecords();
			return Object.getOwnPropertyNames(obj);
        }
    };

    var octopus = {
        init: function(){
            model.init();
            view.init();
        },
        
        getAttendance: function(){
            return model.getRecords();
        },

        getSchedule: function(){
			return { days: model.getDays(), month: model.getMonth()};
        },

        getStudentNames: function(){
			return model.getNames().sort();
        }
    };

    var view = {
        init: function() {
			var dateObj = octopus.getSchedule();
        	this.attendance = octopus.getAttendance();
			this.$h2 = $('h1').after('<h2>'+dateObj.month.toUpperCase()+'</h2>');
            this.$thead = $('thead');
            this.$tbody = $('tbody');
            this.numCols = dateObj.days;
            this.studentNames = octopus.getStudentNames();
            this.numRows = this.studentNames.length;

            view.render();
            view.check_boxes_click();
            console.log(this.studentNames);
        },

        countMissing: function(){
			this.$allMissed = $('tbody .missed-col');
        	this.$allMissed.each(function() {
	            var studentRow = $(this).parent('tr'),
	                dayChecks = $(studentRow).children('td').children('input'),
	                numMissed = 0;

	            dayChecks.each(function() {
	                if (!$(this).prop('checked')) {
	                    numMissed++;
	                }
	            });

	            $(this).text(numMissed);
        	});
        },

        check_boxes: function(){
			this.$allCheckboxes = $('tbody input');
        	$.each(this.attendance, function(name, days) {
		        var studentRow = $('tbody .name-col:contains("' + name + '")').parent('tr'),
		            dayChecks = $(studentRow).children('.attend-col').children('input');

		        dayChecks.each(function(i) {
		            $(this).prop('checked', days[i]);
		        });
		    });
        },

        check_boxes_click: function(){
				this.$allCheckboxes.on('click', function() {
		        var studentRows = $('tbody .student'),
		            newAttendance = {};

		        studentRows.each(function() {
		            var name = $(this).children('.name-col').text(),
		                $allCheckboxes = $(this).children('td').children('input');

		            newAttendance[name] = [];

		            $allCheckboxes.each(function() {
		                newAttendance[name].push($(this).prop('checked'));
		            });
		        });

		        view.countMissing();
		        localStorage.attendance = JSON.stringify(newAttendance);
		    });
        },

        tcols: function(){
			this.$thead.append('<tr>'+
				'<th class="name-col">Student Name</th>'+
				'<th class="missed-col">Days Missed-col</th>'+
				'</tr>'
			);
			var $nameCol = $('thead .name-col');

			for (var i = this.numCols; i >=1; i--){
				$nameCol.after('<th>' + i + '</th>');
			}
		},

        trows: function(){
			for (var i = 0; i <= this.numRows - 1; i++){
				this.$tbody.append('<tr class="student">'+
					'<td class="name-col">'+this.studentNames[i]+'</td>'+
					'<td class="missed-col">0</td>');
			}

			$('.student').each((function(numCols){
				return function(){
					for (var i = 0; i <= numCols - 1; i++){ 
						$(this).children('.name-col').after('<td class="attend-col"><input type="checkbox"></td>');	
					}
				}
			}(this.numCols)));

		},

        render: function() {
			view.tcols();
			view.trows();
			view.check_boxes();
			view.countMissing();
        }
    };

    octopus.init();

}());
