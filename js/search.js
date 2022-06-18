function getBadge(value) {
    switch (value) {
        case "0":
            return '<span class="badge badge-pill uncertain-significance">Uncertain</span>';
        case "1":
            return '<span class="badge badge-pill not-provided">Not provided</span>';
        case "2":
            return '<span class="badge badge-pill benign">Benign</span>';
        case "3"  :
            return '<span class="badge badge-pill likely-benign">Likely benign</span>';
        case "4"  :
            return '<span class="badge badge-pill likely-pathogenic">Likely pathogenic</span>';
        case "5"  :
            return '<span class="badge badge-pill pathogenic">Pathogenic</span>';
        case "6"  :
            return '<span class="badge badge-pill drug-response">Drug response</span>';
        case "7"  :
            return '<span class="badge badge-pill histocompatibility">Histocompatibility</span>';
        case "255" :
            return '<span class="badge badge-pill other">Other</span>';
    }
    return '<span class="badge badge-pill other">?</span>';
}

function dbSNP(value) {
    if (value.startsWith("rs")) {
        return `<a target='_blank' href='https://www.ncbi.nlm.nih.gov/snp/${value}'>${value}</a>`
    } else {
        return value
    }
}

function getQuery(query) {
    let data = {};

    if (/^\s*([1-9]|1[0-9]|2[0-2]|[XY])\s*:\s*(\d+)\s*-\s*(\d+)\s*$/.test(query)) {
        const regexResult = /^\s*([1-9]|1[0-9]|2[0-2]|[XY])\s*:\s*(\d+)\s*-\s*(\d+)\s*$/.exec(query);
        data.referenceName = regexResult[1];
        data.start = parseInt(regexResult[2]);
        data.end = parseInt(regexResult[3]);
    } else if (/^\s*([1-9]|1[0-9]|2[0-2]|[XY])\s*:\s*(\d+)\s*$/.test(query)) {
        const regexResult = /^\s*([1-9]|1[0-9]|2[0-2]|[XY])\s*:\s*(\d+)\s*$/.exec(query);
        data.referenceName = regexResult[1];
        data.start = parseInt(regexResult[2]);
    } else if (/^\s*(rs\d+)\s*$/.test(query)) {
        data.snpId = /^\s*(rs\d+)\s*$/.exec(query)[1].toLowerCase();
    } else if (/^\s*([A-Za-z0-9\-]+)\s*$/.test(query)) {
        data.geneSymbol = /^\s*([A-Za-z0-9\-]+)\s*$/.exec(query)[1].toUpperCase();
    } else {
        return null;
    }

    return data;
}

$(document).ready(function () {
    let queries = $.query.get('queries');
    let assembly = $.query.get('assembly');

    if (queries !== "" && queries !== true) {
        queries = queries.split(',');
        $("#queries").val(queries.join('\n'));
    }

    if (assembly !== "") {
        $("#assembly").val(assembly);
    } else {
        assembly = $("#assembly").find(":selected").val();
    }

    $('#result-table').DataTable({
        serverSide: true,
        processing: true,
        ordering: false,
        scrollX: true,
        searching: false,
        ajax: {
            url: "https://bcbcloud.fcm.unicamp.br/brave/search",
            type: "POST",
            data: function (data) {
                data.queries = [];
                
                for (let i = 0; i < queries.length; i++) {
                    let query = getQuery(queries[i]);
                    if (query !== null) {
                        query.assemblyId = assembly;
                        data.queries[i] = query;
                    }
                }
                
                if (data.queries.length === 0) {
                    data.queries[0] = {assemblyId: assembly};
                }

                return JSON.stringify(data);
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            error: function () {
                $('#result-table_processing').html('Server offline.');
            }
        },
        columnDefs: [{
            defaultContent: "-",
            targets: "_all"
        }],
        columns: [
            {data: 'referenceName'},
            {data: 'start'},
            {data: 'referenceBases'},
            {
                data: 'alternateBases',
                render: function (data) {
                    if (data !== undefined) {
                        return data;
                    } else {
                        return "-";
                    }
                }
            },
            {
                data: 'snpIds',
                render: function (data) {
                    if (data !== undefined) {
                        return data.map(id => dbSNP(id)).join('<br/>');
                    } else {
                        return "-";
                    }
                }
            },
            {
                data: 'alleleFrequency',
                render: function (data) {
                    if (data !== undefined) {
                        return data.map(x => x.toFixed(4));
                    } else {
                        return "-";
                    }
                }
            },

            {
                data: 'geneSymbol',
                render: function (data) {
                    if (data !== undefined) {
                        return Array.from(new Set(data)).join('<br/>');
                    } else {
                        return "-";
                    }
                }
            },
            {
                data: 'hgvs',
                render: function (data) {
                    if (data !== undefined) {
                        return Array.from(new Set(data)).join('<br/>');
                    } else {
                        return "-";
                    }
                }
            },
            {
                data: 'clnsig',
                render: function (data) {
                    if (data !== undefined) {
                        let res = data.match(/(\d+)/g);
                        return Array.from(new Set(res)).map(x => getBadge(x)).join(' ');
                    } else {
                        return "-";
                    }
                }
            },

            {
                data: 'coverage',
                render: function (data) {
                    return `<span class="sparklines">${data.min},${data.q25},${data.median},${data.q75},${data.max}</span>`;
                }
            },
            {
                data: 'genotypeQuality',
                render: function (data) {
                    return `<span class="sparklines">${data.min},${data.q25},${data.median},${data.q75},${data.max}</span>`;
                }
            },

            {data: 'datasetId'},
            {data: 'totalSamples'},
            {data: 'assemblyId'}
        ],
        language: {
            zeroRecords: "No variant found.",
            emptyTable: "No dataset available.",
            processing: "Searching for variants..",
            info: "Showing _START_ to _END_ of _TOTAL_ variants",
            infoFiltered: "(filtered from _MAX_ total variants)",
            infoEmpty: "No variants to show",
            sLengthMenu: "Show _MENU_ variants"
        },
        drawCallback: function () {
            $('.sparklines').sparkline('html', {
                type: "box",
                tooltipFormatFieldlist: ['lw', 'lq', 'med', 'uq', 'rw'],
                raw: true
            });
        }
    });

    $('#queries').keypress(function (event) {
        if (event.keyCode === 13 && event.shiftKey) {
            $('#search-button').click();
        }
    });

    $("#search-button").click(function () {
        window.location.search = $.query
            .set("assembly", $("#assembly").find(":selected").val())
            .set("queries", $("#queries").val().trim().replace(/\r\n|\r|\n/g, ','));
    });
});