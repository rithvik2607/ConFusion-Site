import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody, CardTitle, Breadcrumb, BreadcrumbItem, Button, Modal, ModalHeader, ModalBody, Label, Row } from 'reactstrap';
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Link } from 'react-router-dom';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';

const required = (val) => val && (val.length);
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => val && (val.length >= len);

  function RenderDish({dish}) {
    if(dish!=null) {
      return(
        <div className="col-12 col-md-5 m-1">
          <Card>
            <CardImg width="100%" src={baseUrl + dish.image} alt={dish.name} />
            <CardBody>
              <CardTitle>{dish.name}</CardTitle>
              <CardText>{dish.description}</CardText>
            </CardBody>
          </Card>
        </div>
      );
    } else {
      return(
        <div></div>
      );
    }
  }

  function RenderComments({comments, dishId, addComment}) {
    if(comments==null){
      return(
        <div></div>
      );
    }
    const comment = comments.map(comment => {
      return(
        <li key={comment.id}>
          <p>{ comment.comment }</p>
          <p>--{ comment.author},
          &nbsp;
          {new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            date: '2-digit'
          }).format(new Date(comment.date))}
          </p>
        </li>
      )
    });
    comment.push(<CommentForm dishId={dishId} addComment={addComment}></CommentForm>)
    return(
      <div className="col-12 col-sm-5 m-1">
        <h4>Comments</h4>
        <ul className="list-unstyled">
          {comment}
        </ul>
      </div>
    );
  }

  const Dishdetail = (props) => {
    const dish = props.dish;
    const comment = props.comments;
    const addComment = props.addComment;
    const dishId = props.dish.id;
    if(props.isLoading) {
      return(
        <div className="container">
          <div className="row">
            <Loading />
          </div>
        </div>
      );
    }
    else if(props.errMess) {
      return(
        <div className="container">
          <div className="row">
            <h4>{props.errMess}</h4>
          </div>
        </div>
      );
    }
    else if(dish != null){
      return(
        <div className="container">
          <div className="row">
            <Breadcrumb>
              <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
              <BreadcrumbItem active>{dish.name}</BreadcrumbItem>
            </Breadcrumb>
            <div className="col-12">
              <h3>{dish.name}</h3>
              <hr />
            </div>
          </div>
          <div className="row">
            <RenderDish dish={dish} />
            <RenderComments comments={comment} 
            dishId={dishId}
            addComment={addComment}/>
          </div>
        </div>
      );
    }
  }


class CommentForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false
    };

    this.toggleModal = this.toggleModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  toggleModal() {
    this.setState({
      isModalOpen: !this.state.isModalOpen
    });
  }

  handleSubmit(values) {
    this.props.addComment(this.props.dishId, values.rating, values.author, values.comment);
  }

  render() {
    return(
      <div>
        <Button outline onClick={this.toggleModal}><span className="fa fa-pencil fa-lg"></span> Submit Comment</Button>
        <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
          <ModalBody>
            <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
              <Row className="form-group">
                <Label htmlfor="rating" className="m-2">Rating</Label>
                <Control.select model=".rating" name="rating" class="form-control m-2">
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                </Control.select>
              </Row>
              <Row className="form-group">
                <Label htmlFor="name" className="m-2">Your Name</Label>
                <Control.text model=".author" name="author" id="author" placeholder="Your Name" className="form-control m-2"
                  validators={{
                    required, maxLength: maxLength(15), minLength: minLength(3)
                  }}
                  />
                    <Errors
                      className="text-danger"
                      model=".author"
                      show="touched"
                      messsages={{
                        required: 'Required',
                        maxLength: 'Must be 15 characters or less',
                        minLength: 'Must be greater than 2 characters'
                      }}
                    />
              </Row>
              <Row className="form-group">
                <Label htmlfor="comment" className="m-2">Comment</Label>
                <Control.textarea model=".comment" name="comment" id="comment" rows="6"
                className="form-control m-2"></Control.textarea>
              </Row>
              <Row className="form-group m-2">
                <Button type="submit" color="primary">Submit</Button>
              </Row>
            </LocalForm>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default Dishdetail;