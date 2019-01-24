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
        <span className="breakword">
          {window.location.href}
        </span>
        <p>
          where
          {' '}
          <code>engine_url</code>
          {' '}
          points to the engine and the app containing the data model. Change this to explore another data model.
        </p>
      </div>
    ),
    placement: 'center',
    target: 'body',
  },
  {
    content: (
      <div>
        <p>The highlighted area represents a table in the data model.</p>
        <p>On the top we can see the table name, together with the number of rows in the table.</p>
        <p>Clicking the table header will reorder the tables, the clicked table will be sorted as the leftmost table.</p>
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
          The field name and the number of field values are visible. The number of field values are
          presented in the form of
        </p>
        <code>X of Y</code>
        <p> or </p>
        <code>X of Y(Z)</code>
        <p>
          where
          {' '}
          <code>X</code>
          {' '}
          is the number of field values valid in the current selection,
          {' '}
          <code>Y</code>
          {' '}
          is the values in total and
          {' '}
          <code>Z</code>
          {' '}
          is the number of values present in this table.
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
          The fields are clickable. When clicking on a field, it unfolds and displays the field values with the possibility to make
          selections. Selections can be helpful when exploring the data structure in the app, to see how fields and tables are related.
        </p>
        <p>
          Go ahead, click the field and make a selection!
        </p>
      </div>
    ),
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
    content: (
      <div>
        <p>
          This shows the association between two fields, with basic frequency information on each end of the association line (1, 0/1 or *).
        </p>
        <p>1 - a row in the associated table matches exact one value in this table.</p>
        <p>0/1 - rows in the associated table have zero or one matching row in this table.</p>
        <p>* - a single value may identify several rows in the associated table.</p>
      </div>),
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
    placement: 'left-end',
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
          and it is possible to spot any bad values. If selections are applied, only the selected values
          are displayed.
        </p>
        <p>Add another column by clicking the plus button.</p>
      </div>
    ),
    spotlightClicks: true,
    hideBackButton: true,
    target: '.card:last-child',
    title: 'Hypercube builder',
  },
  {
    step: 'selectAnotherEntity',
    content: 'Click an entity to add it as a column in the cube.',
    placement: 'left',
    spotlightClicks: true,
    hideBackButton: true,
    target: '.cube-column-chooser',
    title: 'Hypercube builder',
  },
  {
    step: 'cubeFinished',
    content: 'More columns can be added to the cube. To close the cube, just click the button in the upper corner.',
    hideBackButton: true,
    target: '.card:last-child',
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
          <code>Start Guide</code>
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
