import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';

import { MatSnackBar } from '@angular/material';

import { GithubModel } from '../models/github.model';
import { GithubService } from '../services/github.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-item-add',
  templateUrl: './item-form.component.html',
  styles: [
    '.container {display: flex; flex-direction: column; }',
    '.form > * { width: 100%;}'],
})

export class ItemFormComponent implements OnInit {
  public items: GithubModel[] = [];
  public item: GithubModel = new GithubModel({});
  public editStatus = true;

  constructor(private githubService: GithubService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              public snackBar: MatSnackBar) {
  }

  formControl = new FormControl('', [
    Validators.required
  ]);

  ngOnInit() {
    // TODO: Reading the parameters on the command line. Edit or Add Mode?
    this.activatedRoute.params.subscribe(
      (params: Params) => {
        if (params.id) {
          this.editStatus = true;
          this.getData(params.id);
        } else {
          this.editStatus = false;
        }
      }
    );
  }

  getData(id: number) {
    this.githubService.getItem(id).subscribe(
      (resp) => {
        this.item = resp;
      },
      (err) => {
        // TODO: add message
        console.log('item-form.component.ts:48 getError', err);
      }
    );
  }

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' :
      this.formControl.hasError('email') ? 'Not a valid email' :
        '';
  }

  handleSubmit() {
    // If Fake
    // if (this.githubService.serverFake) {
    //   this.items.splice(1, 0, this.item);
    //   // If Real Server
    // } else {
    //
    // }

    if (!this.editStatus) {
      // Add Mode
      if (!environment.useMockApi) {
        // Server Real -- Localhost
        this.githubService.addItem(this.item).subscribe(
          (resp) => {
            console.log('item-form.component.ts:51 addItem', resp);
            this.item = new GithubModel({});
          },
          (err) => {
            // TODO: add message
            console.log('item-form.component.ts:56 addError', err);
          }
        );
      } else {
        // Server Fake -- GitHub API service
        this.items.splice(1, 0, this.item);
        this.snackBar.open('A new record was not added because it uses a fake server', 'Close', {
          duration: 4000,
        });
      }
    } else {
      // Edit Mode
      if (!environment.useMockApi) {
        // Server Real -- Localhost
        this.githubService.editItem(this.item).subscribe(
          (resp) => {
            console.log('item-form.component.ts 86: editItem', resp);
          },
          (err) => {
            // TODO: add message
            console.log('item-form.component.ts 90: editError', err);
          }
        );
      } else {
        // Server Fake -- GitHub API service
        this.snackBar.open('This record was not edited because it uses a fake server', 'Close', {
          duration: 3000,
        });
      }
    }
    this.handleCancel();
  }

  handleCancel() {
    this.router.navigate(['/']);
  }
}
