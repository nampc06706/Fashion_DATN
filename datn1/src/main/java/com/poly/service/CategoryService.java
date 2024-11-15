package com.poly.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.poly.dto.CategoryDTO;
import com.poly.entity.Category;
import com.poly.repository.CategoryRepository;

@Service
public class CategoryService {

	@ResponseStatus(HttpStatus.NOT_FOUND)
	public class ResourceNotFoundException extends RuntimeException {
	    public ResourceNotFoundException(String message) {
	        super(message);
	    }
	}
    @Autowired
    private CategoryRepository categoryRepository;

    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(category -> new CategoryDTO(category.getId(), category.getName()))
                .collect(Collectors.toList());
    }

    public CategoryDTO addCategory(CategoryDTO categoryDTO) {
        Category category = new Category();
        category.setName(categoryDTO.getName());
        category = categoryRepository.save(category);
        return new CategoryDTO(category.getId(), category.getName());
    }

    public CategoryDTO updateCategory(Integer id, CategoryDTO categoryDTO) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        category.setName(categoryDTO.getName());
        category = categoryRepository.save(category);
        return new CategoryDTO(category.getId(), category.getName());
    }
    
    public void deleteCategory(Integer id) {
    	 categoryRepository.deleteById(id);
	}
}
