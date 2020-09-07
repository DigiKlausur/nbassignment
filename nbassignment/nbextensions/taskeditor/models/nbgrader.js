define([
], function () {

    'use strict';

    class NbgraderModel {
        
        is_nbgrader(cell) {
            return cell.metadata.hasOwnProperty('nbgrader');
        }
        
        is_locked(cell) {
            return this.is_nbgrader(cell) && cell.metadata.nbgrader.locked;        
        }
        
        is_solution(cell) {
            return this.is_nbgrader(cell) && cell.metadata.nbgrader.solution;
        }
        
        is_grade(cell) {
            return this.is_nbgrader(cell) && cell.metadata.nbgrader.grade;
        }
        
        is_description(cell) {
            return this.is_locked(cell) && !this.is_grade(cell);
        }
        
        is_test(cell) {
            return this.is_locked(cell) && this.is_grade(cell);
        }
        
        set_id(cell, id) {
            if (this.is_nbgrader(cell)) {
                cell.metadata.nbgrader.grade_id = id;
            }
        }
        
        set_points(cell, points) {
            if (this.is_nbgrader(cell)) {
                cell.metadata.nbgrader.points = points;
            }
        }
    }

    return {
        NbgraderModel: NbgraderModel
    }

});