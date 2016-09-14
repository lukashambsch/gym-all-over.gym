import { connect } from 'react-redux'
import { approveVisit, denyVisit } from '../actions'
import VisitList from '../components/VisitList'

const getVisibleVisits = (visits, filter) => {
  switch (filter) {
    case 'SHOW_ALL':
      return visits
    case 'SHOW_PENDING':
      return visits.filter(v => v.status_id === 1)
    case 'SHOW_APPROVED':
      return visits.filter(v => v.status_id === 2)
    case 'SHOW_DENIED':
      return visits.filter(v => v.status_id === 3)
    default:
      throw new Error('Unknown filter: ' + filter)
  }
}

const mapStateToProps = (state) => {
  return {
    visits: getVisibleVisits(state.visits, state.visibilityFilter),
    statuses: state.statuses,
    members: state.members
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onApproveClick: (visit) => {
      dispatch(approveVisit(visit))
    },
    onDenyClick: (visit) => {
      dispatch(denyVisit(visit))
    }
  }
}

const VisibleVisitList = connect(
  mapStateToProps,
  mapDispatchToProps
)(VisitList)

export default VisibleVisitList
