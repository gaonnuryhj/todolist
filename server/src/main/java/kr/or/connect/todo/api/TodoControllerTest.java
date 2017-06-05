package kr.or.connect.todo.api;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.webAppContextSetup;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.context.WebApplicationContext;

@RunWith(SpringRunner.class)
@SpringBootTest
public class TodoControllerTest {

	@Autowired
	WebApplicationContext wac;
	MockMvc mvc;

	@Before
	public void setUp() {
		this.mvc = webAppContextSetup(this.wac)
			.alwaysDo(print(System.out))
			.build();
	}

	@Test
	public void shouldCreate() throws Exception {
		String requestBody = "{\"todo\":\"test\", \"completed\":\"1\"}";
		mvc.perform(
			post("/api/todos/")
				.contentType(MediaType.APPLICATION_JSON)
				.content(requestBody)
			)
		.andExpect(status().isCreated())
		.andExpect(jsonPath("$.id").exists())
		.andExpect(jsonPath("$.todo").value("test"))
		.andExpect(jsonPath("$.completed").value("1"));
		 	
	}
	
	@Test
	public void shouldUpdate() throws Exception {
		String requestBody = "{\"todo\":\"test\", \"completed\":\"0\"}";
		mvc.perform(
			put("/api/todos/1")
				.contentType(MediaType.APPLICATION_JSON)
				.content(requestBody)
			)
			.andExpect(status().isNoContent());
	}

	@Test
	public void shouldDelete() throws Exception {
		mvc.perform(
			delete("/api/todos/1")
				.contentType(MediaType.APPLICATION_JSON)
		)
		.andExpect(status().isNoContent());
	}
	

}