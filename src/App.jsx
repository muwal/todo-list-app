import React, { Component } from 'react';
import { Modal } from 'flowbite';
import axios from 'axios';
import moment from 'moment';
import { Link } from "react-router-dom";
import Detail from './pages/Detail';
import IconPlus from './assets/icon-plus.svg';
import IconDelete from './assets/icon-delete.svg';
import iconAlert from './assets/icon-alert.svg';
import iconAlertSm from './assets/icon-alert-sm.svg';
import emptyActivity from './assets/empty-activity.png';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activities: null,
			activityId: null,
			activityTitle: null,
			activitySearchText: ''
		};
		this.bareUrl = 'https://todo.api.devcode.gethired.id/';
		this.removeActivityModal = null;
		this.removeActivitySuccessModal = null;
	}

	componentDidMount() {
		this.getAllActivities();
		this.setupModals();
	}

	setupModals() {
		this.removeActivityModal = new Modal(document.getElementById('removeActivityModal'), {
			closable: true,
		});
		this.removeActivitySuccessModal = new Modal(document.getElementById('removeActivitySuccessModal'), {
			closable: true,
		});
	}

	removeBackdrop = () => {
		const backdrop = document.querySelectorAll('.modal-backdrop');
		backdrop.forEach(box => {
			box.remove();
		});
	}

	getAllActivities = () => {
		axios.get(this.bareUrl + 'activity-groups?email=awal@skyshi.com')
			.then((response) => {
				const activities = response.data.data;
				this.setState({ activities });
			});
	}

	addActivity = () => {
		axios.post(this.bareUrl + 'activity-groups', {
			email: "awal@skyshi.com",
			title: "New Activity"
		})
			.then(() => {
				this.getAllActivities();
			});
	}

	displayDate = (date) => {
		return moment(date).format('DD MMM YYYY');
	}

	showDeleteActivityModal = (activity) => {
		this.setState({
			activityId: activity.id,
			activityTitle: activity.title
		});
		this.removeActivityModal.show();
	}

	displayActivity = (activities) => {
		if (!activities) {
			return false;
		}

		if (activities.length > 0) {
			return (
				activities.filter((search) => search.title.toLowerCase().includes(this.state.activitySearchText.toLowerCase())).map((activity, index) => {
					return (
						<div className="bg-white rounded-2xl shadow-md p-6 w-[235px] flex flex-col" data-cy="activity-item" key={'activity-item' + index} id={'itemActivities' + index}>
							<Link to={`/detail?id=${activity.id}`} element={<Detail activityId={`${activity.id}`} />} >
								<div className="font-semibold text-lg h-[160px]" data-cy="activity-item-title">
									{activity.title}
								</div>
							</Link>
							<div className="flex mt-auto">
								<div className="text-slate-500" data-cy="activity-item-date">
									{this.displayDate(activity.created_at)}
								</div>
								<div className="ml-auto" data-cy='activity-item-delete-button'>
									<button onClick={() => this.showDeleteActivityModal(activity)}>
										<img src={IconDelete} alt="delete" />
									</button>
								</div>
							</div>
						</div>
					)
				})
			);
		} else {
			return (
				<img src={emptyActivity} alt="empty" className="mx-auto" onClick={this.addActivity} data-cy="activity-empty-state" />
			);
		}
	}

	deleteActivity = () => {
		axios.delete(this.bareUrl + 'activity-groups/' + this.state.activityId)
			.then(() => {
				this.getAllActivities();
				this.setState({
					activityId: null,
					activityTitle: null
				});
				this.closeDeleteModal();
				this.removeActivitySuccessModal.show();
			});
	}

	closeDeleteModal = () => {
		this.removeActivityModal.hide();
	}

	render() {
		return (
			<>
				<section>
					<div className="container mx-auto">
						<div className="mt-12 flex items-center">
							<div className="text-3xl font-bold" data-cy="activity-title">
								Activity
							</div>
							<div className="ml-auto">
								<input type="text" autoFocus className="border-0 border-b-1 border-slate-300 focus:border-slate-500 focus:border-0 focus:border-b-2 focus:ring-0 text-xl px-0 py-2 mr-5 bg-transparent" onChange={(e) => {
									this.setState({
										activitySearchText: e.target.value
									})
								}} placeholder='Search Activity' data-cy="activity-search" />
								<button className="inline-flex py-3 px-6 bg-cyan rounded-full text-white font-semibold" onClick={this.addActivity} data-cy="activity-add-button">
									<div>
										<img src={IconPlus} alt="icon plus" />
									</div>
									<div className="ml-2">
										Tambah
									</div>
								</button>
							</div>
						</div>
						<div className="flex flex-wrap gap-4 mt-12">
							{this.displayActivity(this.state.activities)}
						</div>
					</div>
				</section>

				<div id="removeActivityModal" tabIndex="-1" aria-hidden="true" className="fixed bg-gray-700 bg-opacity-50 top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%)] max-h-full mx-auto">
					<div className="relative w-full max-w-2xl max-h-full" data-cy="modal-delete">
						<div className="relative bg-white rounded-2xl shadow py-6">
							<div className="p-6 text-center">
								<img src={iconAlert} alt="icon alert" className="mx-auto" data-cy="modal-delete-icon" />
								<div className="mt-6" data-cy="modal-delete-title">
									Apakah anda yakin menghapus activity&nbsp;
									<span className="font-semibold">
										"{this.state.activityTitle}"
									</span>
									?
								</div>
							</div>
							<div className="p-6 flex justify-center gap-4">
								<button className="inline-flex py-3 px-6 bg-slate-100 rounded-full text-slate-500 font-semibold" onClick={() => { this.closeDeleteModal() }} data-cy="modal-delete-cancel-button">
									Batal
								</button>
								<button className="inline-flex py-3 px-6 bg-red-500 rounded-full text-white font-semibold" onClick={() => { this.deleteActivity() }} data-cy="modal-delete-confirm-button">
									Hapus
								</button>
							</div>
						</div>
					</div>
				</div>

				<div id="removeActivitySuccessModal" tabIndex="-1" aria-hidden="true" className="fixed top-0 left-0 right-0 bg-gray-700 bg-opacity-50 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%)] max-h-full mx-auto">
					<div className="relative w-full max-w-2xl max-h-full" data-cy="modal-information">
						<div className="relative bg-white rounded-2xl shadow py-6">
							<div className="flex items-center px-6">
								<img src={iconAlertSm} alt="icon alert" data-cy="modal-information-icon" />
								<div className="ml-4" data-cy="modal-information-title">
									Activity berhasil dihapus
								</div>
							</div>
						</div>
					</div>
				</div>
			</>
		);
	}
}

export default App;