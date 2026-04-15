(function () {

  var CASE_STUDIES = [
    {
      file: 'kpi-framework.html',
      title: 'KPI Forecasting Framework: Behavior-Based Visibility',
      subtitle: 'Salesforce-linked dashboards · Rep behavior visibility',
      tags: ['Forecasting', 'KPI', 'Dashboards']
    },
    {
      file: 'email-validation.html',
      title: 'Email Hygiene System: Preventing Bounces at Scale',
      subtitle: 'CRM sync · Bounce prevention · Validation logic',
      tags: ['DataHygiene', 'Salesforce', 'Validation']
    },
    {
      file: 'data-integrity-team.html',
      title: 'Data Integrity System: Keeping CRM Usable at Scale',
      subtitle: 'Operational hygiene · Rep throughput · CRM-embedded workflows',
      tags: ['DataHygiene', 'RecordIntegrity', 'SystemEmbeddedOps']
    },
    {
      file: 'compensation-redesign.html',
      title: 'Comp Plan Overhaul: Aligning Payouts to Funnel Control',
      subtitle: 'Role-specific KPIs · Funnel-stage payout logic',
      tags: ['CompPlan', 'SalesOps', 'KPI']
    },
    {
      file: 'outreach-rollout.html',
      title: 'Outbound System Rebuild: From Duct Tape to Discipline',
      subtitle: 'Cadence automation · 2x meetings booked',
      tags: ['Outreach', 'Salesforce', 'Automation']
    },
    {
      file: 'pluto-resume.html',
      title: 'Pluto Resume: Scaling Delivery Without Formatting Bottlenecks',
      subtitle: 'Custom web app · 80% time savings · Zero drift resume output',
      tags: ['ResumeOps', 'InternalTools', 'Process']
    },
    {
      file: 'dialpad-rollout.html',
      title: 'VoIP as a Strategic Lever: Implementing Dialpad',
      subtitle: 'Coaching enablement · Remote compliance',
      tags: ['CRMIntegration', 'RemoteReadiness', 'CoachingInfrastructure']
    }
  ];

  function getCurrentPage() {
    var path = window.location.pathname;
    var parts = path.split('/');
    var file = parts[parts.length - 1];
    return file || 'index.html';
  }

  function injectHeader() {
    var placeholder = document.getElementById('nav-placeholder');
    if (!placeholder) return;

    var currentPage = getCurrentPage();
    var pages = [
      { href: 'index.html', label: 'Home' },
      { href: 'resume.html', label: 'Resume' },
      { href: 'case-studies.html', label: 'Case Studies' },
      { href: 'contact.html', label: 'Contact' }
    ];

    var navItems = pages.map(function (p) {
      var cls = currentPage === p.href ? ' class="active"' : '';
      return '<li><a href="' + p.href + '"' + cls + '>' + p.label + '</a></li>';
    }).join('');

    var html =
      '<header id="fixed">' +
        '<a class="wordmark" href="index.html">Will Musto</a>' +
        '<button class="hamburger hamburger--elastic" aria-label="Toggle navigation" aria-expanded="false">' +
          '<span class="hamburger-box"><span class="hamburger-inner"></span></span>' +
        '</button>' +
        '<nav><ul>' + navItems + '</ul></nav>' +
      '</header>';

    placeholder.outerHTML = html;
  }

  function getRelatedStudies(currentFile, count) {
    var current = null;
    for (var i = 0; i < CASE_STUDIES.length; i++) {
      if (CASE_STUDIES[i].file === currentFile) {
        current = CASE_STUDIES[i];
        break;
      }
    }

    var pool = CASE_STUDIES.filter(function (s) { return s.file !== currentFile; });

    if (!current) return pool.slice(0, count);

    var scored = pool.map(function (study) {
      var score = 0;
      current.tags.forEach(function (tag) {
        if (study.tags.indexOf(tag) !== -1) score++;
      });
      return { study: study, score: score };
    });

    scored.sort(function (a, b) { return b.score - a.score; });
    return scored.slice(0, count).map(function (s) { return s.study; });
  }

  function injectCaseStudyNav() {
    var currentPage = getCurrentPage();
    if (currentPage === 'branch-ops.html') return;

    var postTitle = document.querySelector('.single-post-title');
    if (!postTitle) return;

    // Back link at top of .single-post-title
    var backLink = document.createElement('a');
    backLink.href = 'case-studies.html';
    backLink.className = 'cs-back-link';
    backLink.textContent = '\u2190 Case Studies';
    postTitle.insertBefore(backLink, postTitle.firstChild);

    // Related studies appended to .single-blog
    var related = getRelatedStudies(currentPage, 2);
    if (related.length === 0) return;

    var itemsHTML = related.map(function (s) {
      return '<div class="cs-more-item">' +
        '<a href="' + s.file + '">' + s.title + '</a>' +
        '<div class="cs-more-subtitle">' + s.subtitle + '</div>' +
        '</div>';
    }).join('');

    var moreSection = document.createElement('div');
    moreSection.className = 'cs-more';
    moreSection.innerHTML = '<h5>More Case Studies</h5>' + itemsHTML;

    var singleBlog = document.querySelector('.single-blog');
    if (singleBlog) {
      singleBlog.appendChild(moreSection);
    }
  }

  function initTagFilter() {
    if (getCurrentPage() !== 'case-studies.html') return;

    var gridItems = document.querySelectorAll('.grid-item');

    document.querySelectorAll('.categories .category').forEach(function (cat) {
      cat.addEventListener('click', function () {
        this.classList.toggle('active');
        applyFilter();
      });
    });

    function applyFilter() {
      var activeFilters = [];
      document.querySelectorAll('.categories .category.active').forEach(function (c) {
        activeFilters.push(c.textContent.trim());
      });

      gridItems.forEach(function (item) {
        if (activeFilters.length === 0) {
          item.classList.remove('hidden');
          return;
        }
        var itemCats = item.querySelectorAll('.category');
        var match = false;
        itemCats.forEach(function (c) {
          if (activeFilters.indexOf(c.textContent.trim()) !== -1) match = true;
        });
        item.classList.toggle('hidden', !match);
      });
    }
  }

  // Synchronous: inject header before jQuery/main.js run
  injectHeader();

  // DOMContentLoaded: inject case study nav and tag filter
  document.addEventListener('DOMContentLoaded', function () {
    injectCaseStudyNav();
    initTagFilter();
  });

}());
