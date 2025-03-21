import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import $ from "jquery";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

window.jQuery = $;
window.$ = $;
global.jQuery = $;

ReactDOM.render(<App />, document.getElementById('root'));

$("#menu-toggle").click(function() {
    $("#wrapper").toggleClass("toggled");
});

$('.modal[data-reset="true"]').on('shown.bs.modal', () =>
    $("input[name != 'timestamp']").val(''));

$('.modal').on('shown.bs.modal', () =>
    $('input[data-reset-input="true"]').val(''));
