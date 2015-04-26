$(function(){
    var model = {
        init: function(){
            if (!localStorage.attendance) {
		        console.log('Creating attendance records...');
		        function getRandom() {
		            return (Math.random() >= 0.5);
		        }

		        var nameColumns = $('tbody .name-col'),
		            attendance = {};

		        nameColumns.each(function() {
		            var name = this.innerText;
		            attendance[name] = [];

		            for (var i = 0; i <= 11; i++) {
		                attendance[name].push(getRandom());
		            }
		        });

		        localStorage.attendance = JSON.stringify(attendance);
		    }
        },

        getRecords: function(){
        	return JSON.parse(localStorage.attendance);
        }
    };

    var octopus = {
        init: function(){
            model.init();
            view.init();
        },
        
        getAttendance: function(){
            return model.getRecords();
        }
    };

    var view = {
        init: function() {
        	this.attendance = octopus.getAttendance();
            this.$allMissed = $('tbody .missed-col');
            this.$allCheckboxes = $('tbody input');
            view.check_boxes_click();
            view.render();
        },

        countMissing: function(){
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

        render: function() {
        	view.check_boxes();
            view.countMissing();
        }
    };

    octopus.init();

}());
