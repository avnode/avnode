import { h } from 'preact'
import { connect } from 'preact-redux'

const General = props => {
  //const { events } = props
  return (
    <div>
    general
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
  }
}

export default connect(mapStateToProps)(General)
