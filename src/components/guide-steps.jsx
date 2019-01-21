import React from 'react';

const steps = [
  {
    content: (
      <div>
        <h2>Welcome to catwalk!</h2>
        <p>
          Catwalk lets you explore your data model to gain
          insights about fields, associations and how interactions
          with the data impacts the model.
        </p>
        <p>
          Follow the guide to discover the power of catwalk.
        </p>
      </div>
    ),
    placement: 'center',
    target: 'body',
  },
  {
    content: (
      <div>
        <h2>Welcome to catwalk!</h2>
        <p>The URL to catwalk is</p>
        {window.location.href}
        <p>
          where
          {' '}
          <i>engine_url</i>
          {' '}
          points to the app containing the data model. Change this to explore another data model.
        </p>
      </div>
    ),
    placement: 'center',
    target: 'body',
  },
  {
    content: (
      <div>
        <p>
          This represents a table in the data model.
        </p>
        <p>On the top we can see the table name, together with the number of rows in the table.</p>
      </div>
    ),
    placement: 'right-start',
    target: '.column',
    title: 'Table',
  },
  {
    content: (
      <div>
        <p>
          Fields, the data-carrying entities in the data model, are represented with a box like this.
        </p>
        <p>
          The field name and the number of field values can be seen.
        </p>
        <p>
          Also, the number of values present in this table is shown in the form of 6 of 6(5)
          which means that 5 out of 6 values are present in this table. Furthermore, if e.g. three field values are
          selected, the numbers would change to 3 of 6(5).
        </p>
      </div>
    ),
    placement: 'right',
    target: '.vertcell.keycell',
    title: 'Field',
  },
  {
    content: (
      <div>
          A field can have different border colors where the color represents different type of keys.
        <div className="guide-step">
          <div className="perfect" />
          <p>Perfect key.</p>
          <p>
            Indicates that every row contains a key value, and that all of these key values are unique.
            The field&apos;s subset ratio is 100 percent.
          </p>
        </div>
        <div className="guide-step">
          <div className="primary" />
          <p>Primary key</p>
          <br />
          <p>
            Indicates that all key values are unique, but not every row contains a key value or
            the field&apos;s subset ratio is less than 100 percent.
          </p>
        </div>
        <div className="guide-step">
          <div className="default" />
          <p>Key</p>
          <br />
          <p>
            Indicates that the key is not unique. Usually seen in fact tables, where the same dimension
            value may be associated with many different facts.
          </p>
        </div>
      </div>
    ),
    target: '.table-field',
    title: 'Field',
    placement: 'right',
  },
  {
    content: (
      <div>
        <p>
          The fields are clickable. When clicking on a field, it will unfold and show the field values with the possibility to make
          selections. Selections might be helpful when trying to figure out the data model, and to find errors in the data model.
        </p>
        <p>
          Go ahead and make a selection!
        </p>
      </div>
    ),
    disableOverlayClose: true,
    hideFooter: true,
    spotlightClicks: true,
    placement: 'right',
    target: '.vertcell.keycell',
    title: 'Field',
  },
  {
    step: 'selections',
    content: (
      <div>
        <p>
          The selections made can be seen in the top bar.
        </p>
        <p>
          Selections in any single field can be removed, or all selections in the app can be removed by clicking the X to the left.
        </p>
      </div>
    ),
    spotlightClicks: true,
    placement: 'bottom',
    target: '.selection-field',
    title: 'Selections',
  },
  {
    content: 'This shows the association between two fields, with basic frequency information on each end of the association line (*, 1 or 0/1).',
    target: '.association-to-right-b',
    title: 'Associations',
  },
  {
    step: 'openHypercubeBuilder',
    content: (
      <div>
        <p>
          Here you can build your own hypercube with the fields, dimensions and
          measure in the app. This could be handy when you want to see how the information
          in the datamodel is connected.
        </p>
        <p>
          Click the button to open the hypercube builder.
        </p>
      </div>
    ),
    spotlightClicks: true,
    disableOverlayClose: true,
    hideFooter: true,
    target: '.add-button',
    title: 'Hypercube builder',
  },
  {
    step: 'selectEntity',
    content: (
      <div>
        <p>Here you can see a list of all the fields, dimensions and measures defined in the app. The input field on top will filter the list.</p>
        <p>Click on an entity to select it.</p>
      </div>
    ),
    disableOverlayClose: true,
    hideFooter: true,
    spotlightClicks: true,
    target: '.cube-column-chooser',
    title: 'Hypercube builder',
  },
  {
    step: 'addAnotherColumn',
    content: (
      <div>
        <p>
          A cube is created with the selected entity as the first column. All the entity values are shown
          and it is possible to spot any errande values. If selections are applied, only the selected values
          are displayed.
        </p>
        <p>Add another column by clicking the plus button.</p>
      </div>
    ),
    disableOverlayClose: true,
    hideFooter: true,
    spotlightClicks: true,
    target: '.card',
    title: 'Hypercube builder',
  },
  {
    step: 'selectAnotherEntity',
    content: 'Click an entity to add it as a column in the cube.',
    placement: 'left',
    disableOverlayClose: true,
    hideFooter: true,
    spotlightClicks: true,
    target: '.cube-column-chooser',
    title: 'Hypercube builder',
  },
  {
    step: 'cubeFinished',
    content: 'Columns can be continued to be added to the cube. To close the cube, just click the button in the upper corner.',
    target: '.card',
    title: 'Hypercube builder',
  },
  {
    content: (
      <div>
        <p>
          Now you can continue to explore your data model with catwalk on your own!
        </p>
        <p>
          To restart the guide, right click and select
          {' '}
          <i>Start Guide</i>
          .
        </p>
      </div>
    ),
    placement: 'bottom',
    target: '.topbarLogo',
    title: 'Guide completed!',
  },
];

export default steps;
