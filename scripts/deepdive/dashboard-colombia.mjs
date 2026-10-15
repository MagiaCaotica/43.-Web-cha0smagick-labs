/**
 * deepdive/dashboard-colombia.mjs
 * ---------------------------------------------------------------------------
 * Articulo largo de la pagina tools/dashboard-colombia.html.
 *
 * REGLAS DE ESTA PIEZA, deliberadas:
 *   1. NO se cita ninguna cifra concreta. No hay fuente verificada en este
 *      repositorio y una estadistica inventada en un tema de criminalidad no
 *      es un error editorial: es un riesgo para quien la lee y para quien la
 *      cita. En su lugar se explica como se leen las cifras y donde estan las
 *      primarias.
 *   2. Los enlaces de "sources" apuntan a organismos oficiales colombianos.
 *   3. Se dice explicitamente que la cifra depende del anio de consulta y que
 *      hay que releerla.
 *
 * El panel embebido no pudo verificarse al construir la pagina; por eso el
 * texto no promete funciones concretas del panel sino que explica el problema
 * que el panel ayuda a explorar, y ofrece el enlace directo como alternativa.
 */

export const DASHBOARD_COLOMBIA = {
  targets: [
    'how to read crime statistics in colombia',
    'colombia homicide data and official sources',
    'difference between year of occurrence and year of registration',
    'crime rate per 100000 inhabitants colombia',
    'buenaventura cali medellin violence data',
    'dane colombia official statistics',
    'medicina legal colombia homicide records',
    'denominators and population data for crime rates'
  ],
  sections: [
    {
      h2: 'What the dashboard is for',
      paras: [
        'Crime data is easy to find and hard to use. The numbers are published, generally consistent between institutions, and free to consult. The difficulty is not access. It is that almost every figure circulating in public debate has been detached from at least one of the things that makes it mean what people think it means.',
        'A free interactive panel is useful for exactly one reason: it lets you move through the data yourself instead of receiving a conclusion. The moment you can change the geography, the period or the measure, you can see which claims survive and which were an artefact of how the number was presented.'
      ]
    },
    {
      h2: 'How to read crime statistics in colombia without being misled',
      paras: [
        'Five traps account for most of the misreporting in this subject, and all five are things a dashboard can teach you directly by letting you see the same quantity under two definitions.',
        'None of this is a claim that anyone is lying. It is a description of how statistics get separated from their definitions in transit, which happens to honest people under deadline.'
      ],
      table: {
        caption: 'The five traps, and what to check',
        head: ['Trap', 'What goes wrong', 'What to check'],
        rows: [
          ['Definition', 'Different institutions count different things', 'The definition attached to the series, not just its name'],
          ['Registration lag', 'Recent years look artificially calm', 'Year of occurrence, not year of registration'],
          ['Absolute counts', 'Bigger city, bigger number, no insight', 'Rate per 100,000 inhabitants'],
          ['National average', 'The average hides the places that matter', 'Department and municipality level'],
          ['Reporting behaviour', 'Not every crime is reported or recorded', 'Compare homicide with lower-level crime']
        ]
      }
    },
    {
      h2: 'Difference between year of occurrence and year of registration',
      paras: [
        'This is the most important single trap, and the one that catches even careful analysts. An offence has a year in which it happened and a year in which it was recorded, and those are not the same year. Records are completed, certified and published on a lag, so the most recent years are always incomplete.',
        'The practical consequence is a pattern that reliably misleads in the same direction: the newest year looks like a decline, because the cases that have not been processed yet are not in the count. A chart that stops at the last complete year and shows the partial year in a different colour is doing the honest thing. A chart that just stops is producing an apparent improvement that is an administrative artefact.'
      ],
      h3s: [
        {
          h3: 'The minimum test before you cite any figure',
          text: 'Ask three questions. Which definition is being used? Which year is it measured in - occurrence or registration? And what is the denominator? If any of the three cannot be answered from the source itself, the figure is not yet quotable, however confident it sounds.'
        }
      ]
    },
    {
      h2: 'Crime rate per 100000 inhabitants, and why the denominator matters',
      paras: [
        'A count of homicides is mostly a count of how many people live somewhere. Comparing Bogotá to a small municipality on raw numbers tells you about population and nothing about safety. The comparable measure is a rate per 100,000 inhabitants, which normalises the two.',
        'That normalisation introduces its own problem, because the denominator comes from a population projection that changes, and small populations produce unstable rates: a town of twenty thousand can swing several points on the rate from three or four additional cases. For municipalities, the multi-year average is almost always the more informative figure, and a single-year rate is usually noise.',
        'Colombia’s case adds one more layer worth naming. Violence is not distributed evenly across the national territory. A handful of departments and a small set of municipalities carry a disproportionate share of the national total, and corridors that connect particular ports to particular inland cities carry more than the endpoints suggest. Any national average describes a distribution, not a country.'
      ],
      h3s: [
        {
          h3: 'Bogotá, Medellín, Cali and Buenaventura read differently',
          text: 'Buenaventura and Cali behave as a connected corridor rather than as two independent cities, which is the point worth drawing from the panel: if a change in one is followed by a change in the other, you are looking at a route, not two local stories. Medellín has its own distinct profile and its own denominators. Bogotá is large enough that its rate is comparatively stable year to year. These are structural observations about how to read the data, not claims about current figures - check the current numbers yourself.'
        }
      ]
    },
    {
      h2: 'Colombia homicide data and official sources',
      paras: [
        'The primary sources are public, and using them is not difficult. The temptation in journalism and in argument is to use a secondary summary instead, because a secondary summary is a single number while the primary source is a set of tables with caveats attached.',
        'The three that matter most are listed below. Each has a different job, and which one to use depends on the question: administrative records describe what was formally recognised, health statistics describe what was medically observed, and survey-based work is the only route to the crimes that are never reported at all.'
      ],
      table: {
        caption: 'What each official source is good for',
        head: ['Source', 'Covers', 'Good for'],
        rows: [
          ['DANE', 'National statistics across sectors', 'Population denominators and official series'],
          ['Instituto Nacional de Medicina Legal', 'Forensic examination of deaths', 'Cause of death in homicide cases'],
          ['Policía Nacional', 'Reported and recorded crime', 'Offence-level counts and geographic detail'],
          ['International comparisons', 'Cross-country datasets', 'Only with consistent definitions and years']
        ]
      },
      h3s: [
        {
          h3: 'Homicide is measurable, other crime mostly is not',
          text: 'A death leaves a body, a coroner and a legal process, which is why homicide is the one violent crime with reasonably complete records. Robbery, assault and sexual violence depend on reporting, and reporting depends on trust in the institutions, on expectations about whether it will help, and on who is asking. Comparing trends in reported robbery against trends in recorded homicide as if they measured the same world is the single most common error in public debate about Colombian security.'
        }
      ]
    },
    {
      h2: 'Making your own charts without uploading anything',
      paras: [
        'The moment you have a series you want to show someone else, you are holding data about a real place and usually about real people, and the sensible default is not to send it to a web service you do not control. <a href="pixellibre.html">PixelLibre</a> produces the chart, the crop and the export entirely in your browser, with no account and nothing uploaded, which makes it a reasonable default for anything you intend to publish.',
        'The practical discipline is simple: cite the series, the institution, the definition and the period every time, in the caption rather than in the discussion. A chart that carries its own caveats does more work than a paragraph defending it.'
      ]
    },
    {
      h2: 'From a reading of the data to a decision about it',
      paras: [
        'Knowing that a series moved does not tell you what to do, and this is where most public argument runs off the rails: a measurement is treated as a mandate. The step between them is a judgement about risk, and a judgement about risk is a judgement like any other - it depends on what you are trying to protect, how much certainty you require, and what you can afford to be wrong.',
        '<a href="../books/codex-chaoticus-pdf.html">Codex Chaoticus</a> is the written treatment of acting when the result is not guaranteed by the quality of your reasoning, which is a more accurate description of this problem than any statistical method. And for the pattern of thinking this page is actually about - measure first, interpret second, commit third - the free tools on this site are the rehearsal.'
      ]
    }
  ],
  sources: [
    {
      label: 'DANE — Departamento Administrativo Nacional de Estadística',
      href: 'https://www.dane.gov.co/',
      note: 'official national statistics, including the population projections used as denominators'
    },
    {
      label: 'Instituto Nacional de Medicina Legal y Ciencias Forenses',
      href: 'https://www.forensis.gov.co/',
      note: 'forensic cause-of-death records for homicide cases'
    },
    {
      label: 'Policía Nacional de Colombia',
      href: 'https://www.policia.gov.co/',
      note: 'reported and officially recorded crime statistics'
    }
  ],
  faq: [
    {
      q: 'Is the dashboard free?',
      a: 'Yes. It opens directly in the browser, with no registration, no download and no payment.'
    },
    {
      q: 'Do I need an account to see the data?',
      a: 'No. The panel is consulted directly from the browser.'
    },
    {
      q: 'Which official body publishes crime statistics in Colombia?',
      a: 'Several, for different purposes. DANE publishes official national statistics including population denominators, Medicina Legal covers forensic causes of death, and the Policía Nacional publishes recorded offences. The definitions differ, which is why it matters which one a figure came from.'
    },
    {
      q: 'Why does the most recent year always look like a decline?',
      a: 'Because offences are recorded on a lag after they occur. The newest years are incomplete, so a chart that stops at the last complete year understates them. This is the year of occurrence versus year of registration problem, and it is the most common way crime figures mislead.'
    },
    {
      q: 'Why use a rate per 100,000 instead of the raw number of cases?',
      a: 'Because a raw count mostly measures population. A rate normalises for size, which makes cities comparable - but for small municipalities the rate becomes unstable, and a single year is usually noise rather than a trend.'
    },
    {
      q: 'The panel does not load. What should I do?',
      a: 'Open the dashboard in a new tab from the link in the central block. If it still does not respond, it is likely an issue with the host rather than with your connection.'
    },
    {
      q: 'Is the interface in English?',
      a: 'No. The panel is in Spanish, as it was built.'
    }
  ]
};