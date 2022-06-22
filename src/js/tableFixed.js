// https://github.com/lai32290/TableHeadFixer
(function ($) {

    $.fn.tableFixer = function (param) {

        return this.each(function () {
            table.call(this);
        });

        function table() {
            /**
             * This function solver z-index problem in corner cell
             * where fix row and column at the same time,
             * set corner cells z-index 1 more then other fixed cells
             */


            // Set style of table parent
            function setParent() {
                var parent = $(settings.parent);
                var table = $(settings.table);

                parent.on('scroll', $.proxy(function () {
                    var scrollWidth = parent[0].scrollWidth;
                    var clientWidth = parent[0].clientWidth;
                    var scrollHeight = parent[0].scrollHeight;
                    var scroll_left = parent.scrollLeft();
                    var table_position = {
                        left: table[0].offsetLeft,
                        top: table[0].offsetTop,
                    };
                    table_position.right = scrollWidth - table_position.left - table.width();
                    table_position.bottom = scrollHeight - table_position.top - table.height();

                    if (settings.left > 0) {
                        var left = scroll_left - table_position.left;
                        if(Math.round(left)){
                            settings.leftColumns.css("left", left)
                            settings.leftColumns.addClass('fix-first-column');
                        } else {
                            settings.leftColumns.css("left", 0)
                            settings.leftColumns.removeClass('fix-first-column');
                        }
                    }
                    if (settings.right > 0) {
                        var right = scrollWidth - clientWidth - scroll_left - table_position.right;
                        if(Math.round(right)){
                            settings.rightColumns.css("right", right)
                            settings.rightColumns.addClass('fix-last-column');
                        } else {
                            settings.rightColumns.css("right", 0)
                            settings.rightColumns.removeClass('fix-last-column');
                        }

                    }
                }, table));
            }

            // Set table left column fixed
            function fixLeft() {
                var table = $(settings.table);

                settings.leftColumns = $();

                var tr = table.find("> thead > tr, > tbody > tr, > tfoot > tr");
                tr.each(function (k, row) {

                    solveLeftColspan(row, function (cell) {
                        settings.leftColumns = settings.leftColumns.add(cell);
                    });
                });

                var column = settings.leftColumns;

                column.each(function (k, cell) {
                    cell = $(cell);

                    //setBackground(cell);
                    cell.css({
                        //'position': 'relative',
                        //'z-index': settings['z-index'],
                    });
                });
            }

            // Set table right column fixed
            function fixRight() {
                var table = $(settings.table);

                settings.rightColumns = $();

                var tr = table.find("> thead > tr, > tbody > tr, > tfoot > tr");
                tr.each(function (k, row) {
                    solveRightColspan(row, function (cell) {
                        settings.rightColumns = settings.rightColumns.add(cell);
                    });
                });

                var column = settings.rightColumns;

                column.each(function (k, cell) {
                    cell = $(cell);

                    //setBackground(cell);
                    cell.css({
                        //'position': 'relative',
                        //'z-index': settings['z-index'],
                    });
                });

            }

            function solveLeftColspan(row, action) {
                var fixColumn = settings.left;
                var inc = 1;

                for (var i = 1; i <= fixColumn; i = i + inc) {
                    var nth = inc > 1 ? i - 1 : i;

                    var cell = $(row).find("> *:nth-child(" + nth + ")");
                    var colspan = cell.prop("colspan");

                    if (typeof cell.cellPos() !== 'undefined' && cell.cellPos().left < fixColumn) {
                        action(cell);
                    }

                    inc = colspan;
                }
            }

            function solveRightColspan(row, action) {
                var fixColumn = settings.right;
                var inc = 1;
                for (var i = 1; i <= fixColumn; i = i + inc) {
                    var nth = inc > 1 ? i - 1 : i;

                    var cell = $(row).find("> *:nth-last-child(" + nth + ")");
                    var colspan = cell.prop("colspan");
                    action(cell);
                    inc = colspan;
                }
            }

            var defaults = {
                head: true,
                foot: false,
                left: 0,
                right: 0,
                'z-index': 6,
            };

            var settings = $.extend({}, defaults, param);
            settings.head = Boolean(settings.head);
            settings.foot = Boolean(settings.foot);
            settings.table = this;
            settings.parent = $(settings.table).parent();
            setParent();

            if (settings.left > 0) {
                fixLeft();
            }

            if (settings.right > 0) {
                fixRight();
            }

            $(settings.parent).trigger("scroll");

            $(window).resize(function () {
                $(settings.parent).trigger("scroll");
            });
        }
    };

})(jQuery);

/**
 * cellPos jQuery plugin
 * ---------------------
 * Get visual position of cell in HTML table (or its block like thead).
 * Return value is object with "top" and "left" properties set to row
 * and column index of top-left cell corner.
 * Example of use:
 * $("#myTable tbody td").each(function(){
 *   $(this).text( $(this).cellPos().top +", "+ $(this).cellPos().left );
 * });
 */
(function ($) {
    /* scan individual table and set "cellPos" data in the form { left: x-coord, top: y-coord } */
    function scanTable($table) {
        var m = [];
        $table.children("tr").each(function (y, row) {
            $(row).children("td, th").each(function (x, cell) {
                var $cell = $(cell),
                    colspan = $cell.attr("colspan") | 0,
                    rowspan = $cell.attr("rowspan") | 0,
                    tx, ty;
                colspan = colspan ? colspan : 1;
                rowspan = rowspan ? rowspan : 1;

                // noinspection StatementWithEmptyBodyJS
                for (; m[y] && m[y][x]; ++x); //skip already occupied cells in current row

                for (tx = x; tx < x + colspan; ++tx) {  //mark matrix elements occupied by current cell with true
                    for (ty = y; ty < y + rowspan; ++ty) {
                        if (!m[ty]) {  //fill missing rows
                            m[ty] = [];
                        }
                        m[ty][tx] = true;
                    }
                }
                var pos = {top: y, left: x};
                $cell.data("cellPos", pos);
            });
        });
    }

    /* plugin */
    $.fn.cellPos = function (rescan) {
        var $cell = this.first(),
            pos = $cell.data("cellPos");
        if (!pos || rescan) {
            var $table = $cell.closest("table, thead, tbody, tfoot");
            scanTable($table);
        }
        pos = $cell.data("cellPos");
        return pos;
    }
})(jQuery);