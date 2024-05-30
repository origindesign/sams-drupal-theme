<?php

/**
 * @file
 * Contains \Drupal\includer\Controller\EventCalendarController
 */

namespace Drupal\includer\Controller;

use Drupal\Core\Datetime\DrupalDateTime;



/**
 * The specific class to gather includes and pass to template
 *
 */
class EventCalendarController extends ContentController {


  public function getIncludes () {

    $this->result["listing_ajax"] = $this->getNodes();
    $this->result["filters"] = $this->createFilters();
    $this->result["additional_classes"] = 'events with-date';
    $this->result["content_class"] = 'inner-grid';

    return $this->result;

  }


  protected function getNodes(){

    // Get current date plus one month
    $now = new DrupalDateTime('now');
    $plusMonth = new DrupalDateTime('now +2 weeks');

    $fromDate = $now->format("Y-m-d") .' 00:00:01';
    $toDate = $plusMonth->format("Y-m-d") .' 23:59:59';

    $urlParams = '{"from":"'.$fromDate.'","to":"'.$toDate.'","category":"All"}';

    return [
      '#type' => 'markup',
      '#markup' => "<div class='content-container ajax-list-container ajax-events loading' data-ajax-path='/ajax-event-calendar' data-default-params='".$urlParams."'></div>"
    ];

  }


  protected function createFilters(){

    // Get current dates
    $now = new DrupalDateTime('now');
    $plusMonth = new DrupalDateTime('now +2 weeks');

    // Get filters
    $from = $now->format("M j, Y");
    $to = $plusMonth->format("M j, Y");
    $categories = $this->getTermsFromVocabulary('event_category', 'tid', 'All Categories', 'All');

    $form = \Drupal::formBuilder()->getForm('Drupal\efq\Form\FilterForm');
    $form['#attributes'] = array('class' => ['filterform d-flex ai-center jc-center filters filter-count-3']);

    $form["container"] =  array(
      'from' => array(
        '#attributes' => [
          'id' => 'from',
          'class' => ['from-date','filter-list','form-type-date'],
          'data-filter-group' => "from",
          'inputmode' => "none"
        ],
        '#label_attributes' => [
          'for' => 'from'
        ],
        '#title' => t('Start Date'),
        '#type' => 'textfield',
        '#value' => $from
      ),
      'to' => array(
        '#attributes' => [
          'id' => 'to',
          'class' => ['to-date','filter-list','form-type-date'],
          'data-filter-group' => "to",
          'inputmode' => "none"
        ],
        '#label_attributes' => [
          'for' => 'to'
        ],
        '#title' => t('End Date'),
        '#type' => 'textfield',
        '#value' => $to
      ),
      'categories' => array(
        '#attributes' => [
          'id' => 'categories',
          'class' => ['categories','filter-list'],
          'data-filter-group' => "categories"
        ],
        '#label_attributes' => [
          'for' => 'categories'
        ],
        '#title' => t('Category'),
        '#type' => 'select',
        '#options' => $categories
      )
    );

    return $form;

  }


}
