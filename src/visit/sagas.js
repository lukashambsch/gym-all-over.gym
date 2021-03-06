// @flow
import { call, put, takeLatest, fork, select } from 'redux-saga/effects'

import visitApi from './api';
import { CREATE_VISIT, UPDATE_VISIT, REQUEST_VISITS, REQUEST_VISIT } from './actions';
import { receiveVisit, receiveVisits, createVisitSuccess, updateVisitSuccess, failVisitRequest } from './actions';
import type { Visit } from './types';

export function* createVisit(action: Object): any {
  try {
    yield call(visitApi.createVisit, action.visit);
    yield put(createVisitSuccess());
  } catch(e) {
    yield put(failVisitRequest(e));
  }
}

export function* updateVisit(action: Object): any {
  try {
    yield call(visitApi.updateVisit, action.visit);
    yield put(updateVisitSuccess());
  } catch(e) {
    yield put(failVisitRequest(e));
  }
}

export function* getVisits(action: Object): any {
  try {
    const visits = yield call(visitApi.getVisits);

    yield put(receiveVisits(visits));
  } catch(e) {
    yield put(failVisitRequest(e));
  }
}

export function* getVisit(action: Object): any {
  try {
    let visit: Visit = yield select((state) => {
      return state.visits.items[action.visit_id]
    });

    if (!visit) {
      visit = yield call(visitApi.getVisit, action.visit_id);
    }

    yield put(receiveVisit(visit));
  } catch(e) {
    yield put(failVisitRequest(e));
  }
}

export function* getVisitSaga(): any {
  yield takeLatest(REQUEST_VISIT, getVisit);
}

export function* getVisitsSaga(): any {
  yield takeLatest(REQUEST_VISITS, getVisits);
}

export function* createVisitSaga(): any {
  yield takeLatest(CREATE_VISIT, createVisit);
}

export function* updateVisitSaga(): any {
  yield takeLatest(UPDATE_VISIT, updateVisit);
}

function* visitSaga(): any {
  yield [
    fork(getVisitSaga),
    fork(getVisitsSaga),
    fork(createVisitSaga),
    fork(updateVisitSaga)
  ];
}

export default visitSaga;
