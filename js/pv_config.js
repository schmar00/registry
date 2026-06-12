
const ENDPOINT = 'https://fuseki.geoinformation.dev/registry/sparql';
const DOMAIN = 'https://registry.inspire.gv.at';

const PAGE = {
    title: {
        de: 'Austrian INSPIRE Registry',
        en: 'Austrian INSPIRE Registry'
    },
    codelist: {
        heading: {
            de: 'Österreichisches Register für Codelisten',
            en: 'Austrian code list register'
        },
        subheading: {
            de: 'INSPIRE Daten- und Dienste Provider und Codelisten',
            en: 'INSPIRE Data and Service Providers and Code Lists'
        },
        desc: {
            de: 'Das österreichische Codelistenregister enthält Referenzcodes für Vokabulare und dessen Erweiterung für die INSPIRE Implementierung. Bestehende Codelisten und deren Werte können für weitere Anpassungen des kontrollierten Vokabulars ausserhalb INSPIRE verwendet werden. Das österreichische <a style="color:#295471" href="§?uri=https://registry.inspire.gv.at/dataprovider">Geodatenstellenregister</a> enthält die INSPIRE Datenanbieter.',
            en: 'The Austrian code list register provides reference codes for vocabulary extensions used for INSPIRE implementation. Existing code lists and their values can be used for further alignments of controlled vocabulary. The Austrian <a style="color:#295471" href="§?uri=https://registry.inspire.gv.at/dataprovider">data provider register</a> contains the contributing data providers.'
        },
        scope: {
            de: 'Anmerkung:',
            en: 'Scope note:'
        }
    },
    dataprovider: {
        heading: {
            de: 'Geodatenstellenregister INSPIRE Österreich',
            en: 'Austrian data provider register'
        },
        subheading: {
            de: 'INSPIRE Datenanbieter',
            en: 'INSPIRE data providers'
        },
        desc: {
            de: 'Das österreichische Geodatenstellenregister enthält die INSPIRE Datenanbieter.',
            en: 'The austrian data provider register contains the contributing data providers.'
        },
        tabheading: {
            de: 'weitere Geodatenstellen',
            en: 'more Data Providers'
        },
        cardheader: {
            de: 'Geodatenstelle',
            en: 'Data Provider'
        },
    }
}

var config = {
    init: function (any) {
        config.projects = [];

        for (const [projectId, project] of Object.entries(config.projectConfiguration)) {
            config.projects.push(project);
        }
    },
    getProject: function (uri) {
        let p = uri.split('/')[3];
        p = p.split('-')[0];
        return p;
    }
};

function addVocProj(vocProjects) {

    config.projectConfiguration = vocProjects;
    config.init(false);
    
}

var ws = {
    endpoint: ENDPOINT,
    getProject: function (uri) {
        return config.getProject(uri);
    },
    projectJson: function (projectId, query, filteredItem, thenFunc) { 
        console.log(query)
        query = ws.processSparql(projectId, query, filteredItem);
        console.log(query)
        return fetch(this.endpoint + '?query=' + encodeURIComponent(query) + '&format=json')
            .then(res => res.json())
            .then(thenFunc)
            .catch(error => {
                if (!$('#outOfService').length) {
                    $('#rightSidebar').append(`<div id="outOfService" class="alert alert-dismissible alert-primary">
                                                <button type="button" class="close" data-dismiss="alert">&times;</button>
                                                <h4 class="alert-heading">Service downtime:</h4>
                                                    <p class="mb-0">
                                                        PV is currently not available!
                                                    </p>
                                                </div>`);
                }
            });
    },
    processSparql: function (projectId, query, filteredItem) {
        let project = projectId ? config.projectConfiguration[projectId] : null;
        let filter = project ? config.projectConfiguration[projectId].filter : null;
        if (!filter) {
            filter = "";
        }
        if (!filteredItem) {
            filteredItem = "c";
        }
        query = query.replaceAll('@@filter', filter).replaceAll('@@item', filteredItem);

        let from = project ? project.from : null;
        if (!from) {
            from = "";
        }
        query = query.replaceAll('@@from', from);

        return query;
    }
};