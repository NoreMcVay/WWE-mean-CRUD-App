import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-wrestler-details-modal',
  templateUrl: './wrestler-details-modal.component.html',
  styleUrls: ['./wrestler-details-modal.component.scss']
})
export class WrestlerDetailsModalComponent implements OnInit {
  @Input() wrestlerData;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  getModalBrandColor(wrestlerBrand) {
    return {
      myCustomColorRed: wrestlerBrand === 'Raw',
      myCustomColorBlue: wrestlerBrand === 'SmackDown',
      myCustomColorGold: wrestlerBrand === 'NXT'
    };
  }

}
